import CanvasManager from '../../utils/Managers/CanvasManager';
import Pacman from '../../entities/Pacman';
import { GameStatus } from '../../enums';
import { LevelAccessor } from '../../types/LevelAccessor';

/**
 * System responsible for rendering the game
 */
export default class RenderSystem {
    private readonly canvasManager: CanvasManager;

    /**
     * @param {CanvasManager} canvasManager - Canvas manager
     */
    constructor(canvasManager: CanvasManager) {
        this.canvasManager = canvasManager;
    }

    /**
     * Clear the canvas and draw the background
     */
    clearAndDrawBackground(): void {
        this.canvasManager.clear();
        this.canvasManager.drawBackground();
    }

    /**
     * Render the game based on current status
     * @param {GameStatus} status - Current game status
     * @param {LevelAccessor} level - Current level (using LevelAccessor interface)
     * @param {Pacman} pacman - Pacman entity
     * @param {number} score - Current score
     * @param {number} levelNumber - Current level number
     * @param {boolean} ghostsScared - Whether ghosts are scared
     * @param {boolean} showPath - Whether to show path
     */
    render(
        status: GameStatus,
        level: LevelAccessor | null,
        pacman: Pacman,
        score: number,
        levelNumber: number,
        ghostsScared: boolean,
        showPath: boolean
    ): void {
        // Skip if level is not loaded
        if (!level && ![GameStatus.NameInput, GameStatus.HighScores].includes(status)) return;

        // Get player lives
        const lives = pacman ? pacman.getLives() : 0;

        // Render based on game status
        switch (status) {
            case GameStatus.GameOver:
                this.canvasManager.drawGameOver(score);
                break;

            case GameStatus.Victory:
                this.canvasManager.drawVictory(score);
                break;

            case GameStatus.Paused:
                // Render game world first, then overlay pause screen
                this.renderGameWorld(level!, pacman, score, levelNumber, ghostsScared, showPath);
                this.canvasManager.drawPaused();
                break;

            case GameStatus.NameInput:
                // Name input handled by UI Manager
                this.canvasManager.getUIManager().drawUI(status, score, lives, levelNumber);
                break;

            case GameStatus.HighScores:
                // High scores handled by UI Manager
                this.canvasManager.getUIManager().drawUI(status, score, lives, levelNumber);
                break;

            default:
                // Playing or Loading
                if (level) {
                    this.renderGameWorld(level, pacman, score, levelNumber, ghostsScared, showPath);
                }
                break;
        }
    }

    /**
     * Render the actual game world (entities)
     * @param {LevelAccessor} level - Current level (using LevelAccessor interface)
     * @param {Pacman} pacman - Pacman entity
     * @param {number} score - Current score
     * @param {number} levelNumber - Current level number
     * @param {boolean} ghostsScared - Whether ghosts are scared
     * @param {boolean} showPath - Whether to show path
     */
    private renderGameWorld(
        level: LevelAccessor,
        pacman: Pacman,
        score: number,
        levelNumber: number,
        ghostsScared: boolean,
        showPath: boolean
    ): void {
        const ctx = this.canvasManager.getContext();
        const tileSize = level.getTileSize();

        // Draw entities
        pacman.draw(ctx);

        // Draw ghosts
        level.getGhosts().forEach(ghost => {
            ghost.draw(ctx, ghostsScared, showPath, tileSize);
        });

        // Draw dots
        level.getDots().forEach(dot => {
            dot.draw(ctx);
        });

        // Draw walls
        level.getWalls().forEach(wall => {
            wall.draw(ctx);
        });

        // Draw pellets
        level.getPellets().forEach(pellet => {
            pellet.draw(ctx);
        });

        // Draw HUD
        this.canvasManager.drawHUD(score, pacman.getLives(), levelNumber);
    }
    
    /**
     * Show error message
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    showError(title: string, message: string): void {
        this.canvasManager.drawError(title, message);
    }
}