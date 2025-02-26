import Game from './game/Game';
import CanvasManager from './utils/Managers/CanvasManager';
import InputManager from './utils/Managers/InputManager';
import AudioManager from './utils/Managers/AudioManager';
import EventMediator from './game/EventMediator';
import ErrorHandler from './utils/Errors/ErrorHandler';
import { DEFAULT_CONFIG, WASD_CONFIG } from './types';
import RenderSystem from './game/Systems/RenderSystem';
import { GameError } from './utils/Errors/GameError';
import { GameErrorType, GameEventType } from './enums';

/**
 * Main entry point for the Pacman game
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize error handling
    setupGlobalErrorHandling();
    
    try {
        // Initialize canvas
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) {
            throw new GameError(
                GameErrorType.InitializationError,
                'Canvas element not found'
            );
        }
        
        // Initialize managers
        const canvasManager = new CanvasManager(canvas);
        
        // The makeResponsive method is now called in the CanvasManager constructor
        
        // Add a window resize event listener
        window.addEventListener('resize', () => {
            if (canvasManager) {
                canvasManager.resize();
            }
        });
        
        // Use arrow keys by default, but allow switching to WASD
        const inputConfig = localStorage.getItem('pacman-controls') === 'wasd' 
            ? WASD_CONFIG 
            : DEFAULT_CONFIG;
        
        const inputManager = new InputManager(inputConfig);
        
        // Initialize audio disabled by default to prevent autoplay errors
        // Only enable if explicitly set in localStorage
        const soundEnabled = localStorage.getItem('pacman-sound') === 'on';
        const audioManager = new AudioManager(soundEnabled);
        
        // Initialize event mediator (singleton)
        const eventMediator = EventMediator.getInstance();
        
        // Initialize render system
        const renderSystem = new RenderSystem(canvasManager);
        
        try {
            // Preload sounds
            await audioManager.loadSounds();
            
            // Initialize and start game
            const game = new Game(canvasManager, inputManager, audioManager);
            
            // Add event listeners for control options
            setupControlListeners(inputManager, game, eventMediator);
            setupSoundListeners(audioManager, eventMediator);
            
            // Setup error handling via the mediator
            setupErrorHandling(eventMediator);
            
            // Load default level and start game
            await game.loadDefaultLevel();
            game.start();
            
        } catch (error) {
            // Handle specific known errors
            handleGameInitError(error, renderSystem);
        }
    } catch (error) {
        // Handle critical errors that prevent the game from starting
        console.error('Critical error initializing game:', error);
        showCriticalErrorMessage();
    }
});

/**
 * Set up global error handling
 */
function setupGlobalErrorHandling(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason;
        console.error('Unhandled promise rejection:', error);
        
        if (error instanceof GameError) {
            ErrorHandler.logError(error);
        }
    });
    
    // Handle global errors
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        if (event.error instanceof GameError) {
            ErrorHandler.logError(event.error);
        }
        
        // Prevent default browser error handling
        event.preventDefault();
    });
}

/**
 * Handle errors during game initialization
 * @param {unknown} error - Error that occurred
 * @param {RenderSystem} renderSystem - Render system for showing errors
 */
function handleGameInitError(error: unknown, renderSystem: RenderSystem): void {
    let errorMessage = 'An unknown error occurred.';
    let errorType = GameErrorType.InitializationError;
    
    if (error instanceof GameError) {
        ErrorHandler.logError(error);
        errorMessage = error.message;
        errorType = error.type;
    } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Game initialization error:', error);
    } else {
        console.error('Unknown game initialization error:', error);
    }
    
    // Show appropriate error message based on error type
    switch (errorType) {
        case GameErrorType.LevelLoadError:
            renderSystem.showError('Failed to load level', errorMessage);
            break;
            
        case GameErrorType.AudioLoadError:
            renderSystem.showError('Failed to load audio', errorMessage);
            break;
            
        case GameErrorType.NetworkError:
            renderSystem.showError('Network error', errorMessage);
            break;
            
        default:
            renderSystem.showError('Failed to initialize game', errorMessage);
            break;
    }
}

/**
 * Set up control option listeners
 * @param {InputManager} inputManager - Input manager
 * @param {Game} game - Game instance
 * @param {EventMediator} eventMediator - Event mediator
 */
function setupControlListeners(
    inputManager: InputManager, 
    game: Game, 
    eventMediator: EventMediator
): void {
    const arrowBtn = document.getElementById('arrow-controls');
    const wasdBtn = document.getElementById('wasd-controls');
    
    if (arrowBtn && wasdBtn) {
        // Handle arrow keys option
        arrowBtn.addEventListener('click', () => {
            inputManager.changeConfiguration(DEFAULT_CONFIG);
            localStorage.setItem('pacman-controls', 'arrows');
            
            // Highlight selected option
            arrowBtn.classList.add('selected');
            wasdBtn.classList.remove('selected');
            
            // Restart game through the mediator
            eventMediator.notify({
                type: GameEventType.GameResumed,
                data: { controlsChanged: true }
            });
            
            // Re-register pacman movement
            game.restartGame();
        });
        
        // Handle WASD option
        wasdBtn.addEventListener('click', () => {
            inputManager.changeConfiguration(WASD_CONFIG);
            localStorage.setItem('pacman-controls', 'wasd');
            
            // Highlight selected option
            wasdBtn.classList.add('selected');
            arrowBtn.classList.remove('selected');
            
            // Restart game through the mediator
            eventMediator.notify({
                type: GameEventType.GameResumed,
                data: { controlsChanged: true }
            });
            
            // Re-register pacman movement
            game.restartGame();
        });
        
        // Set initial selection
        if (localStorage.getItem('pacman-controls') === 'wasd') {
            wasdBtn.classList.add('selected');
        } else {
            arrowBtn.classList.add('selected');
        }
    }
}

/**
 * Set up sound option listeners
 * @param {AudioManager} audioManager - Audio manager
 * @param {EventMediator} eventMediator - Event mediator
 */
function setupSoundListeners(
    audioManager: AudioManager,
    eventMediator: EventMediator
): void {
    const soundOnBtn = document.getElementById('sound-on');
    const soundOffBtn = document.getElementById('sound-off');
    
    if (soundOnBtn && soundOffBtn) {
        // Handle sound on option
        soundOnBtn.addEventListener('click', () => {
            audioManager.setSoundEnabled(true);
            localStorage.setItem('pacman-sound', 'on');
            
            // Highlight selected option
            soundOnBtn.classList.add('selected');
            soundOffBtn.classList.remove('selected');
            
            // Notify through mediator
            eventMediator.notify({
                type: GameEventType.GameResumed,
                data: { soundChanged: true, soundEnabled: true }
            });
        });
        
        // Handle sound off option
        soundOffBtn.addEventListener('click', () => {
            audioManager.setSoundEnabled(false);
            localStorage.setItem('pacman-sound', 'off');
            
            // Highlight selected option
            soundOffBtn.classList.add('selected');
            soundOnBtn.classList.remove('selected');
            
            // Notify through mediator
            eventMediator.notify({
                type: GameEventType.GameResumed,
                data: { soundChanged: true, soundEnabled: false }
            });
        });
        
        // Set initial selection based on sound enabled state
        if (audioManager.isSoundEnabled()) {
            soundOnBtn.classList.add('selected');
            soundOffBtn.classList.remove('selected');
        } else {
            soundOffBtn.classList.add('selected');
            soundOnBtn.classList.remove('selected');
        }
    }
}

/**
 * Setup error handling for the game
 * @param {EventMediator} eventMediator - Event mediator
 */
function setupErrorHandling(
    eventMediator: EventMediator
): void {
    eventMediator.register(GameEventType.GameOver, () => {
        // Any specific error handling to do on game over
    });
}

/**
 * Show a critical error message (when canvas isn't available)
 */
function showCriticalErrorMessage(): void {
    // Create an error overlay when canvas isn't available
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.color = 'red';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    
    const errorTitle = document.createElement('h1');
    errorTitle.textContent = 'Critical Error';
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to initialize game. Please refresh the page or check the console for details.';
    errorMessage.style.color = 'white';
    
    overlay.appendChild(errorTitle);
    overlay.appendChild(errorMessage);
    document.body.appendChild(overlay);
}