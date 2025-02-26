import BackgroundAnimation from '../Animations/BackgroundAnimation';
import UIManager from '../../UI/UIManager';
import { GameStatus } from '../../enums';

/**
 * Manages the canvas and provides drawing utilities
 */
export default class CanvasManager {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private backgroundAnimation: BackgroundAnimation | null;
    private uiManager: UIManager;

    /**
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {boolean} setupBackground - Whether to set up default background animation
     */
    constructor(canvas: HTMLCanvasElement, setupBackground: boolean = true) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context');
        }

        this.ctx = context;
        this.width = canvas.width;
        this.height = canvas.height;

        // Initialize background animation if requested
        this.backgroundAnimation = setupBackground ?
            new BackgroundAnimation("res/space.jpg") : null;

        // Initialize UI manager
        this.uiManager = new UIManager(this.ctx, this.width, this.height);

        // Set up pixel-perfect rendering
        this.setupHighDPICanvas();
        this.makeResponsive();
    }

    /**
     * Set up high DPI canvas for sharper rendering on high-DPI displays
     */
    private setupHighDPICanvas(): void {
        const dpr = window.devicePixelRatio || 1;

        // Set display size (CSS pixels)
        const rect = this.canvas.getBoundingClientRect();

        // Set actual size in memory (scaled to account for extra pixel density)
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Scale all drawing operations by the dpr
        this.ctx.scale(dpr, dpr);

        // Ensure the canvas appears the right size on the page
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        // Update width and height properties
        this.width = rect.width;
        this.height = rect.height;

        // Update UI manager with new dimensions
        this.uiManager = new UIManager(this.ctx, this.width, this.height);
    }

    /**
     * Resize canvas to match container or window size
     */
    resize(): void {
        const parent = this.canvas.parentElement;
        if (parent) {
            const rect = parent.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.width = rect.width;
            this.height = rect.height;

            // Update UI manager with new dimensions
            this.uiManager.resize(this.width, this.height);
        }
    }

    /**
     * Clear the canvas
     * @param {string} color - Background color
     */
    clear(color: string = 'black'): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draw the animated background
     */
    drawBackground(): void {
        if (this.backgroundAnimation) {
            this.backgroundAnimation.update();
            this.backgroundAnimation.draw(this.ctx, this.width, this.height);
        }
    }

    /**
     * Draw game over screen
     * @param {number} score - Player score
     */
    drawGameOver(score: number): void {
        this.clear();
        this.uiManager.drawUI(GameStatus.GameOver, score, 0, 1);
    }

    /**
     * Draw pause screen
     */
    drawPaused(): void {
        this.uiManager.drawUI(GameStatus.Paused, 0, 0, 1);
    }

    /**
     * Draw game HUD (Heads-Up Display)
     * @param {number} score - Current score
     * @param {number} lives - Remaining lives
     * @param {number} level - Current level
     */
    drawHUD(score: number, lives: number, level: number = 1): void {
        this.uiManager.drawUI(GameStatus.Playing, score, lives, level);
    }

    /**
     * Draw victory screen
     * @param {number} score - Player score
     */
    drawVictory(score: number): void {
        this.uiManager.drawUI(GameStatus.Victory, score, 0, 1);
    }

    /**
     * Draw error screen
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    drawError(title: string, message: string): void {
        this.clear();
        this.uiManager.drawError(title, message);
    }

    /**
     * Get canvas context
     * @returns {CanvasRenderingContext2D} Canvas context
     */
    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    /**
     * Get canvas width
     * @returns {number} Canvas width
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Get canvas height
     * @returns {number} Canvas height
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Get UI Manager
     * @returns {UIManager} UI Manager
     */
    getUIManager(): UIManager {
        return this.uiManager;
    }

    /**
     * Set background animation
     * @param {BackgroundAnimation|null} animation - Background animation or null to disable
     */
    setBackgroundAnimation(animation: BackgroundAnimation | null): void {
        this.backgroundAnimation = animation;
    }

    /**
    * Make the canvas responsive to window size
    */
    makeResponsive(): void {
        const resizeCanvas = () => {
            const parent = this.canvas.parentElement;
            if (!parent) return;

            const maxWidth = Math.min(window.innerWidth * 0.9, 900);
            const maxHeight = Math.min(window.innerHeight * 0.8, 900);

            // Maintain aspect ratio (1:1 for our game)
            const size = Math.min(maxWidth, maxHeight);

            // Set CSS dimensions (display size)
            this.canvas.style.width = `${size}px`;
            this.canvas.style.height = `${size}px`;

            // Canvas internal dimensions remain the same for consistent gameplay
            // This just scales the display, not the actual game coordinate system

            // Center the canvas horizontally
            this.canvas.style.margin = '20px auto';

            // Update UI manager with new display dimensions
            this.uiManager.resize(this.width, this.height);
        };

        // Initial resize
        resizeCanvas();

        // Resize on window resize
        window.addEventListener('resize', resizeCanvas);
    }
}