import UIComponent from '../UIComponent';

/**
 * Pause screen UI component
 */
export default class PauseScreen extends UIComponent {
    /**
     * Draw the pause screen
     */
    override draw(): void {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw "Paused" text
        this.ctx.font = "bold 40px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Paused", this.width / 2, this.height / 2);
        
        // Draw continue instruction
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Press ESC to Continue", this.width / 2, this.height / 2 + 50);
    }
}