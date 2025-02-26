import { HighScoreEntry } from "../../types";
import UIComponent from "../UIComponent";

/**
 * Screen to display high scores
 */
export default class HighScoreScreen extends UIComponent {
  private readonly scores: HighScoreEntry[];
  private readonly onClose: () => void;
  private animationFrame: number;

  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Component width
   * @param {number} height - Component height
   * @param {HighScoreEntry[]} scores - Array of high scores
   * @param {Function} onClose - Callback when screen is closed
   */
  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scores: HighScoreEntry[],
    onClose: () => void
  ) {
    super(ctx, width, height);
    this.scores = scores;
    this.onClose = onClose;
    this.animationFrame = 0;

    // Setup event listeners
    this.setupKeyboardListeners();
  }

  /**
   * Set up keyboard listeners
   */
  private setupKeyboardListeners(): void {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape' || event.key === ' ') {
        this.close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Store reference to remove event listener later
    (this as any)._handleKeyDown = handleKeyDown;
  }

  /**
   * Draw the high score screen
   */
  override draw(): void {
    this.animationFrame++;
    const ctx = this.ctx;

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw title with blinking effect
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = this.animationFrame % 60 < 30 ? 'yellow' : 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HIGH SCORES', this.width / 2, this.height / 5);

    // Draw score table
    const tableTop = this.height / 3;
    const rowHeight = 40;
    
    // Draw table headers
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText('Rank', this.width / 5, tableTop);
    ctx.textAlign = 'center';
    ctx.fillText('Name', this.width / 2 - 40, tableTop);
    ctx.textAlign = 'right';
    ctx.fillText('Score', this.width * 0.7, tableTop);
    ctx.fillText('Level', this.width * 0.85, tableTop);

    // Draw horizontal line under headers
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.width / 5 - 20, tableTop + 20);
    ctx.lineTo(this.width * 0.85 + 20, tableTop + 20);
    ctx.stroke();

    // Draw scores
    ctx.font = '20px monospace';
    this.scores.forEach((score, index) => {
      const y = tableTop + 40 + (index * rowHeight);
      
      // Highlight rank with different colors
      switch (index) {
        case 0:
          ctx.fillStyle = 'gold';
          break;
        case 1:
          ctx.fillStyle = 'silver';
          break;
        case 2:
          ctx.fillStyle = '#cd7f32'; // bronze
          break;
        default:
          ctx.fillStyle = 'white';
          break;
      }
      
      // Draw rank
      ctx.textAlign = 'left';
      ctx.fillText(`${index + 1}.`, this.width / 5, y);
      
      // Draw name
      ctx.textAlign = 'center';
      ctx.fillText(score.name, this.width / 2 - 40, y);
      
      // Draw score
      ctx.textAlign = 'right';
      ctx.fillText(score.score.toString(), this.width * 0.7, y);
      
      // Draw level
      ctx.fillText(score.level.toString(), this.width * 0.85, y);
    });

    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Press ENTER or SPACE to continue', this.width / 2, this.height * 0.85);
  }

  /**
   * Close the high score screen
   */
  private close(): void {
    // Remove event listener
    document.removeEventListener('keydown', (this as any)._handleKeyDown);
    
    // Call onClose callback
    this.onClose();
  }

  /**
   * Cleanup when component is no longer needed
   */
  dispose(): void {
    document.removeEventListener('keydown', (this as any)._handleKeyDown);
  }
}