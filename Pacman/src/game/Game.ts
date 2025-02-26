import Pacman from '../entities/Pacman';
import LevelLoader from './Level/LevelLoader';
import AudioManager from '../utils/Managers/AudioManager';
import CanvasManager from '../utils/Managers/CanvasManager';
import InputManager from '../utils/Managers/InputManager';
import GameState from './GameState';
import EventMediator from './EventMediator';
import { GameEventType, GameStatus } from '../enums';
import RenderSystem from './Systems/RenderSystem';
import { ScoreSystem } from './Systems/ScoreSystem';
import { InputSystem } from './Systems/InputSystem';
import { EntitySystem } from './Systems/EntitySystem';
import { EventSystem } from './Systems/EventSystem';
import Level from './Level/Level';

/**
 * Main game class using composition
 */
export default class Game {
  // Core systems
  private readonly inputSystem: InputSystem;
  private readonly entitySystem: EntitySystem;
  private readonly eventSystem: EventSystem;
  private readonly renderSystem: RenderSystem;
  private readonly scoreSystem: ScoreSystem;

  // Core managers
  private readonly canvasManager: CanvasManager;
  private readonly audioManager: AudioManager;
  private readonly gameState: GameState;

  // Game objects
  private readonly pacman: Pacman;

  // Game settings
  private readonly levelPath: string;

  /**
   * @param {CanvasManager} canvasManager - Canvas manager
   * @param {InputManager} inputManager - Input manager
   * @param {AudioManager} audioManager - Audio manager
   * @param {string} initialLevelPath - Path to initial level file
   */
  constructor(
    canvasManager: CanvasManager,
    inputManager: InputManager,
    audioManager: AudioManager,
    initialLevelPath: string = "res/levels/level1.txt"
  ) {
    // Initialize core managers and state
    this.canvasManager = canvasManager;
    this.audioManager = audioManager;

    // Initialize game objects
    this.pacman = new Pacman(0, 0, 20); // Position will be set by level
    this.levelPath = initialLevelPath;

    // Initialize core systems using composition
    const eventMediator = EventMediator.getInstance();

    // Create ScoreSystem first
    this.scoreSystem = new ScoreSystem(eventMediator);

    // Create GameState with ScoreSystem
    this.gameState = new GameState(
      this.scoreSystem,
      this.handleGameStatusChange.bind(this)
    );

    this.renderSystem = new RenderSystem(canvasManager);

    this.eventSystem = new EventSystem(
      eventMediator,
      this.gameState,
      this.audioManager
    );

    this.entitySystem = new EntitySystem(
      this.pacman,
      this.audioManager,
      eventMediator,
      this.gameState
    );

    this.inputSystem = new InputSystem(
      inputManager,
      this.pacman,
      this.gameState,
      this.restartGame.bind(this)
    );

    // Set up high score event handling
    this.setupHighScoreEvents(eventMediator);
  }

  /**
   * Set up high score event handling
   * @param {EventMediator} eventMediator - Event mediator
   */
  private setupHighScoreEvents(eventMediator: EventMediator): void {
    eventMediator.register(GameEventType.GameOver, (event) => {
      if (event.data && typeof event.data.score === 'number') {
        this.handlePotentialHighScore(event.data.score);
      }
    });

    eventMediator.register(GameEventType.LevelCompleted, (event) => {
      if (event.data && typeof event.data.score === 'number') {
        this.handlePotentialHighScore(event.data.score);
      }
    });
  }

  /**
   * Handle potential high score
   * @param {number} score - Final score
   */
  private handlePotentialHighScore(score: number): void {
    // Get the UI manager from the canvas manager
    const uiManager = this.canvasManager.getUIManager();

    // Check if score qualifies as a high score
    if (uiManager.isHighScore()) {
      // Show the name input screen
      this.gameState.showNameInput();

      uiManager.showNameInput((name: string) => {
        // Add the score to high scores
        uiManager.addHighScore(name);

        // Notify about high score
        EventMediator.getInstance().notify({
          type: GameEventType.HighScoreAdded,
          data: { name, score }
        });

        // Show high scores
        this.showHighScoresAndRestart(uiManager);
      });
    } else {
      // Show high scores without adding a new entry
      this.showHighScoresAndRestart(uiManager);
    }
  }

  /**
   * Show high scores and restart the game after closing
   * @param {any} uiManager - UI Manager
   */
  private showHighScoresAndRestart(uiManager: any): void {
    this.gameState.showHighScores();
    uiManager.showHighScores(uiManager.getHighScores(), () => {
      // After high scores are closed, restart the game
      this.restartGame();
    });
  }

  /**
   * Handle game status changes
   * @param {GameStatus} status - New game status
   */
  private handleGameStatusChange(status: GameStatus): void {
    switch (status) {
      case GameStatus.Playing:
        // Resume game logic
        if (this.pacman) {
          this.pacman.setSpeedMagnitude(3); // Normal speed
        }
        break;

      case GameStatus.Paused:
      case GameStatus.NameInput:
      case GameStatus.HighScores:
        // Pause game logic for all non-playing states
        if (this.pacman) {
          this.pacman.setSpeedMagnitude(0); // Stop movement
        }
        break;
    }
  }

  /**
   * Load level
   * @param {string} levelPath - Path to level file
   * @returns {Promise<void>} Promise that resolves when level is loaded
   */
  async loadLevel(levelPath: string): Promise<void> {
    try {
      // Reset state - extracted to a separate method
      this.resetGameState();

      // Load level - extracted to a separate method
      const level = await this.loadLevelData(levelPath);
      this.entitySystem.setLevel(level);

      // Play starting sound
      this.audioManager.play('beginning');

      // Start game
      this.gameState.startGame();

      // Notify that level was loaded - extracted to a separate method
      this.notifyLevelLoaded(levelPath);

    } catch (error) {
      console.error("Error loading level:", error);
      throw error;
    }
  }

  /**
   * Reset game state
   * Extracted method to improve Law of Demeter compliance
   */
  private resetGameState(): void {
    this.gameState.reset();
    this.entitySystem.reset();
    this.pacman.cleanup();
  }

  /**
   * Load level data
   * Extracted method to improve Law of Demeter compliance
   * @param {string} levelPath - Path to level file
   * @returns {Promise<Level>} Promise that resolves with loaded level
   */
  private async loadLevelData(levelPath: string): Promise<Level> {
    const canvasWidth = this.canvasManager.getWidth();
    const loader = await LevelLoader.fromFile(levelPath, canvasWidth);
    return loader.buildLevel(this.pacman);
  }

  /**
   * Notify that level was loaded
   * Extracted method to improve Law of Demeter compliance
   * @param {string} levelPath - Path to loaded level
   */
  private notifyLevelLoaded(levelPath: string): void {
    const currentLevel = this.gameState.getLevel();

    EventMediator.getInstance().notify({
      type: GameEventType.LevelLoaded,
      data: {
        level: currentLevel,
        path: levelPath
      }
    });
  }

  /**
   * Load default level
   * @returns {Promise<void>} Promise that resolves when level is loaded
   */
  loadDefaultLevel(): Promise<void> {
    return this.loadLevel(this.levelPath);
  }

  /**
   * Restart the game
   */
  restartGame(): void {
    this.loadDefaultLevel();
  }

  /**
   * Start the game
   */
  start(): void {
    this.gameLoop();
  }

  /**
   * Game loop
   */
  private gameLoop(): void {
    // Update all systems
    this.inputSystem.update();
    this.entitySystem.update();
    this.eventSystem.update();
    this.scoreSystem.update();

    // Render the game
    this.render();

    // Request next frame
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  /**
   * Render game
   * Improved to follow Law of Demeter
   */
  private render(): void {
    // Clear canvas and draw background
    this.renderSystem.clearAndDrawBackground();

    // Get all the state needed for rendering
    const gameStatus = this.gameState.getStatus();
    const score = this.gameState.getScore();
    const levelNumber = this.gameState.getLevel();
    const areGhostsScared = this.gameState.areGhostsScared();
    const shouldShowPath = this.gameState.shouldShowPath();
    const currentLevel = this.entitySystem.getLevel();

    // Render game using only the directly needed parameters
    this.renderSystem.render(
      gameStatus,
      currentLevel,
      this.pacman,
      score,
      levelNumber,
      areGhostsScared,
      shouldShowPath
    );
  }
}