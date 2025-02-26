import UIComponent from './UIComponent';

/**
 * Heads-Up Display (HUD) UI component
 */
export default class HUD extends UIComponent {
    private readonly padding: number;
    private iconSize: number;
    
    /**
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Component width
     * @param {number} height - Component height
     * @param {number} padding - Padding from edges
     */
    constructor(
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number,
        padding: number = 20
    ) {
        super(ctx, width, height);
        this.padding = padding;
        this.iconSize = 15; // Size for life indicators and other icons
    }
    
    /**
     * Draw the HUD
     * @param {number} score - Current score
     * @param {number} lives - Remaining lives
     * @param {number} level - Current level
     */
    override draw(score: number, lives: number, level: number = 1): void {
        this.drawScore(score);
        this.drawLives(lives);
        this.drawLevel(level);
    }
    
    /**
     * Draw score section
     * @param {number} score - Current score
     */
    private drawScore(score: number): void {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        
        // Format score with commas for thousands
        const formattedScore = score.toLocaleString();
        this.ctx.fillText(`Score: ${formattedScore}`, this.padding, this.padding);
    }
    
    /**
     * Draw lives section
     * @param {number} lives - Remaining lives
     */
    private drawLives(lives: number): void {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        
        // Draw "Lives:" text
        this.ctx.fillText(`Lives:`, this.padding, this.padding + 40);
        
        // Draw life indicators
        for (let i = 0; i < lives; i++) {
            this.drawLifeIcon(
                this.padding + 80 + (i * (this.iconSize + 10)), 
                this.padding + 40 + 10
            );
        }
    }
    
    /**
     * Draw a single life icon
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    private drawLifeIcon(x: number, y: number): void {
        this.ctx.beginPath();
        this.ctx.fillStyle = "yellow";
        this.ctx.arc(
            x, 
            y, 
            this.iconSize / 2, 
            0.25 * Math.PI, 
            1.75 * Math.PI
        );
        this.ctx.lineTo(x, y);
        this.ctx.fill();
    }
    
    /**
     * Draw level section
     * @param {number} level - Current level
     */
    private drawLevel(level: number): void {
        this.ctx.font = "20px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "top";
        
        this.ctx.fillText(`Level: ${level}`, this.padding, this.padding + 80);
    }
    
    /**
     * Set icon size for life indicators
     * @param {number} size - New icon size
     */
    setIconSize(size: number): void {
        this.iconSize = size;
    }
}