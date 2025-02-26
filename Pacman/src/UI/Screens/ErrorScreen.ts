import UIComponent from '../UIComponent';

/**
 * Error screen UI component
 */
export default class ErrorScreen extends UIComponent {
    /**
     * Draw the error screen
     * @param {string} title - Error title
     * @param {string} message - Error message
     */
    override draw(title: string, message: string): void {
        // Fill background
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw error title
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.width / 2, this.height / 2 - 50);
        
        // Wrap long messages
        const maxWidth = this.width - 100;
        this.wrapText(message, this.width / 2, this.height / 2, maxWidth, 25);
        
        // Draw instruction
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Please refresh the page to try again.', this.width / 2, this.height / 2 + 100);
    }
    
    /**
     * Wrap text to multiple lines
     * @param {string} text - Text to wrap
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} maxWidth - Maximum width before wrapping
     * @param {number} lineHeight - Height of each line
     */
    private wrapText(
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
    ): void {
        const words = text.split(' ');
        let line = '';
        let lineY = y;

        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && line !== '') {
                this.ctx.fillText(line, x, lineY);
                line = word + ' ';
                lineY += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        this.ctx.fillText(line, x, lineY);
    }
}