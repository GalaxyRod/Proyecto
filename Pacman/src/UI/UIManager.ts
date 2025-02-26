import GameOverScreen from './Screens/GameOverScreen';
import VictoryScreen from './Screens/VictoryScreen';
import PauseScreen from './Screens/PauseScreen';
import HUD from './HUD';
import ErrorScreen from './Screens/ErrorScreen';
import NameInputScreen from './Screens/NameInputScreen';
import HighScoreScreen from './Screens/HighScoreScreen';
import { GameStatus } from '../enums';
import HighScoreManager from '../utils/Scores/HighScoreManager';
import { HighScoreEntry } from '../types';

/**
 * Manages all UI components
 */
export default class UIManager {
    private readonly ctx: CanvasRenderingContext2D;
    
    // UI Components
    private readonly gameOverScreen: GameOverScreen;
    private readonly victoryScreen: VictoryScreen;
    private readonly pauseScreen: PauseScreen;
    private readonly hud: HUD;
    private readonly errorScreen: ErrorScreen;
    
    // High score UI components - will be created as needed
    private nameInputScreen: NameInputScreen | null = null;
    private highScoreScreen: HighScoreScreen | null = null;
    
    // Callback for when name input is confirmed
    private onNameConfirmed: ((name: string) => void) | null = null;
    
    // Callback for when high score screen is closed
    private onHighScoresClosed: (() => void) | null = null;
    
    // Current score for high score entry
    private currentScore: number = 0;
    private currentLevel: number = 1;
    
    /**
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        
        // Initialize UI components
        this.gameOverScreen = new GameOverScreen(ctx, width, height);
        this.victoryScreen = new VictoryScreen(ctx, width, height);
        this.pauseScreen = new PauseScreen(ctx, width, height);
        this.hud = new HUD(ctx, width, height);
        this.errorScreen = new ErrorScreen(ctx, width, height);
    }
    
    /**
     * Draw UI based on game status
     * @param {GameStatus} status - Current game status
     * @param {number} score - Current score
     * @param {number} lives - Remaining lives
     * @param {number} level - Current level
     */
    drawUI(
        status: GameStatus,
        score: number,
        lives: number,
        level: number
    ): void {
        // Save current score and level for high score entry
        this.currentScore = score;
        this.currentLevel = level;
        
        switch (status) {
            case GameStatus.GameOver:
                this.gameOverScreen.draw(score);
                break;
                
            case GameStatus.Victory:
                this.victoryScreen.draw(score);
                break;
                
            case GameStatus.Paused:
                // Draw HUD first, then overlay with pause screen
                this.hud.draw(score, lives, level);
                this.pauseScreen.draw();
                break;
                
            case GameStatus.NameInput:
                // Draw name input screen if available
                if (this.nameInputScreen) {
                    this.nameInputScreen.draw();
                }
                break;
                
            case GameStatus.HighScores:
                // Draw high score screen if available
                if (this.highScoreScreen) {
                    this.highScoreScreen.draw();
                }
                break;
                
            case GameStatus.Playing:
            case GameStatus.Loading:
                // Just draw the HUD during normal gameplay
                this.hud.draw(score, lives, level);
                break;
        }
    }
    
    /**
     * Draw error screen
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    drawError(title: string, message: string): void {
        this.errorScreen.draw(title, message);
    }
    
    /**
     * Show name input screen
     * @param {Function} onConfirm - Callback for when name is confirmed
     */
    showNameInput(onConfirm: (name: string) => void): void {
        // Create name input screen
        this.nameInputScreen = new NameInputScreen(
            this.ctx,
            this.getWidth(),
            this.getHeight(),
            this.currentScore,
            (name: string) => {
                if (this.onNameConfirmed) {
                    this.onNameConfirmed(name);
                }
                
                // Clean up after confirmation
                if (this.nameInputScreen) {
                    this.nameInputScreen.dispose();
                    this.nameInputScreen = null;
                }
                
                // Call the provided callback
                onConfirm(name);
            }
        );
        
        // Save callback
        this.onNameConfirmed = onConfirm;
    }
    
    /**
     * Show high score screen
     * @param {HighScoreEntry[]} scores - High scores to display
     * @param {Function} onClose - Callback for when screen is closed
     */
    showHighScores(scores: HighScoreEntry[], onClose: () => void): void {
        // Create high score screen
        this.highScoreScreen = new HighScoreScreen(
            this.ctx,
            this.getWidth(),
            this.getHeight(),
            scores,
            () => {
                if (this.onHighScoresClosed) {
                    this.onHighScoresClosed();
                }
                
                // Clean up after closing
                if (this.highScoreScreen) {
                    this.highScoreScreen.dispose();
                    this.highScoreScreen = null;
                }
                
                // Call the provided callback
                onClose();
            }
        );
        
        // Save callback
        this.onHighScoresClosed = onClose;
    }
    
    /**
     * Add the current score to high scores
     * @param {string} name - Player name
     * @returns {boolean} True if score was added to high scores
     */
    addHighScore(name: string): boolean {
        const highScoreManager = HighScoreManager.getInstance();
        return highScoreManager.addScore(name, this.currentScore, this.currentLevel);
    }
    
    /**
     * Check if the current score is a high score
     * @returns {boolean} True if the current score is a high score
     */
    isHighScore(): boolean {
        const highScoreManager = HighScoreManager.getInstance();
        return highScoreManager.isHighScore(this.currentScore);
    }
    
    /**
     * Get all high scores
     * @returns {HighScoreEntry[]} High scores
     */
    getHighScores(): HighScoreEntry[] {
        const highScoreManager = HighScoreManager.getInstance();
        return highScoreManager.getScores();
    }
    
    /**
     * Get HUD component
     * @returns {HUD} HUD component
     */
    getHUD(): HUD {
        return this.hud;
    }
    
    /**
     * Get canvas width
     * @returns {number} Canvas width
     */
    getWidth(): number {
        return this.ctx.canvas.width;
    }
    
    /**
     * Get canvas height
     * @returns {number} Canvas height
     */
    getHeight(): number {
        return this.ctx.canvas.height;
    }
    
    /**
     * Resize UI components
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width: number, height: number): void {
        // Re-create components with new dimensions
        (this as any).gameOverScreen = new GameOverScreen(this.ctx, width, height);
        (this as any).victoryScreen = new VictoryScreen(this.ctx, width, height);
        (this as any).pauseScreen = new PauseScreen(this.ctx, width, height);
        (this as any).hud = new HUD(this.ctx, width, height);
        (this as any).errorScreen = new ErrorScreen(this.ctx, width, height);
        
        // Reset optional screens
        this.nameInputScreen = null;
        this.highScoreScreen = null;
    }
    
    /**
     * Dispose of resources
     */
    dispose(): void {
        // Clean up any resources
        if (this.nameInputScreen) {
            this.nameInputScreen.dispose();
            this.nameInputScreen = null;
        }
        
        if (this.highScoreScreen) {
            this.highScoreScreen.dispose();
            this.highScoreScreen = null;
        }
    }
}