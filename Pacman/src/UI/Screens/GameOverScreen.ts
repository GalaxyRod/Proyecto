import UIComponent from "../UIComponent";

/**
 * Game over screen UI component
 */
export default class GameOverScreen extends UIComponent {
    /**
     * Draw the game over screen
     * @param {number} score - Final score
     */
    override draw(score: number): void {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw "Game Over" text
        this.ctx.font = "bold 40px Arial";
        this.ctx.fillStyle = "red";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Game Over", this.width / 2, this.height / 2);
        
        // Draw score
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Score: ${score}`, this.width / 2, this.height / 2 - 100);
        
        // Draw restart instruction
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Press Space to Restart", this.width / 2, this.height / 2 + 80);
    }
}
