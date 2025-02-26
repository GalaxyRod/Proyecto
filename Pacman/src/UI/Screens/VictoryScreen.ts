import UIComponent from '../UIComponent';

/**
 * Victory screen UI component
 */
export default class VictoryScreen extends UIComponent {
    /**
     * Draw the victory screen
     * @param {number} score - Final score
     */
    override draw(score: number): void {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw victory message
        this.ctx.font = "bold 40px Arial";
        this.ctx.fillStyle = "gold";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("VICTORY!", this.width / 2, this.height / 2);

        // Draw score
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`Score: ${score}`, this.width / 2, this.height / 2 - 100);

        // Draw instruction
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Press Space to Play Again", this.width / 2, this.height / 2 + 80);
    }
}