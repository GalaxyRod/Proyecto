import UIComponent from "../UIComponent";

/**
 * Name input screen for high scores
 */
export default class NameInputScreen extends UIComponent {
  private name: string;
  private cursorPosition: number;
  private readonly letters: string;
  private blinkTimer: number;
  private blinkVisible: boolean;
  private readonly callback: (name: string) => void;
  private readonly score: number;

  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Component width
   * @param {number} height - Component height
   * @param {number} score - Player's score
   * @param {Function} callback - Callback function when name is confirmed
   */
  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    score: number,
    callback: (name: string) => void
  ) {
    super(ctx, width, height);
    
    this.name = 'AAAA'; // Default name
    this.cursorPosition = 0;
    this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
    this.blinkTimer = 0;
    this.blinkVisible = true;
    this.callback = callback;
    this.score = score;

    // Setup event listeners
    this.setupKeyboardListeners();
  }

  /**
   * Set up keyboard listeners
   */
  private setupKeyboardListeners(): void {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          this.changeLetterUp();
          break;
        case 'ArrowDown':
          this.changeLetterDown();
          break;
        case 'ArrowLeft':
          this.moveCursorLeft();
          break;
        case 'ArrowRight':
          this.moveCursorRight();
          break;
        case 'Enter':
          this.confirm();
          break;
        default:
          // Allow typing letters directly
          if (event.key.length === 1) {
            const upperKey = event.key.toUpperCase();
            if (this.letters.includes(upperKey)) {
              this.setLetter(upperKey);
              this.moveCursorRight();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Store reference to remove event listener later
    (this as any)._handleKeyDown = handleKeyDown;
  }

  /**
   * Draw the name input screen
   */
  override draw(): void {
    const ctx = this.ctx;

    // Update blink timer
    this.blinkTimer++;
    if (this.blinkTimer >= 30) { // 30 frames = 0.5 seconds at 60fps
      this.blinkTimer = 0;
      this.blinkVisible = !this.blinkVisible;
    }

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw title
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HIGH SCORE!', this.width / 2, this.height / 3 - 50);

    // Draw score
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${this.score}`, this.width / 2, this.height / 3);

    // Draw input prompt
    ctx.fillText('Enter Your Name:', this.width / 2, this.height / 3 + 50);

    // Draw name input box
    const boxWidth = 200;
    const boxHeight = 60;
    const boxLeft = (this.width - boxWidth) / 2;
    const boxTop = this.height / 3 + 100;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(boxLeft, boxTop, boxWidth, boxHeight);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxLeft, boxTop, boxWidth, boxHeight);

    // Draw name letters
    ctx.font = 'bold 40px monospace';
    ctx.fillStyle = 'white';

    const letterWidth = boxWidth / 4;
    for (let i = 0; i < 4; i++) {
      const letterX = boxLeft + (i * letterWidth) + letterWidth / 2;
      const letterY = boxTop + boxHeight / 2;

      // Highlight current letter position
      if (i === this.cursorPosition) {
        ctx.fillStyle = 'yellow';
        if (this.blinkVisible) {
          ctx.fillRect(
            boxLeft + (i * letterWidth) + 5,
            boxTop + 5,
            letterWidth - 10,
            boxHeight - 10
          );
        }
        ctx.fillStyle = 'black';
      } else {
        ctx.fillStyle = 'white';
      }

      ctx.fillText(this.name[i], letterX, letterY);
    }

    // Draw instructions
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Arrow Keys: Change Letters | Enter: Confirm', this.width / 2, boxTop + boxHeight + 40);
  }

  /**
   * Change current letter to the next one in the alphabet
   */
  private changeLetterUp(): void {
    if (this.cursorPosition < 0 || this.cursorPosition >= 4) return;

    const currentChar = this.name[this.cursorPosition];
    const currentIndex = this.letters.indexOf(currentChar);
    const nextIndex = (currentIndex + 1) % this.letters.length;
    const nextChar = this.letters[nextIndex];

    this.name = 
      this.name.substring(0, this.cursorPosition) + 
      nextChar + 
      this.name.substring(this.cursorPosition + 1);
  }

  /**
   * Change current letter to the previous one in the alphabet
   */
  private changeLetterDown(): void {
    if (this.cursorPosition < 0 || this.cursorPosition >= 4) return;

    const currentChar = this.name[this.cursorPosition];
    const currentIndex = this.letters.indexOf(currentChar);
    const prevIndex = (currentIndex - 1 + this.letters.length) % this.letters.length;
    const prevChar = this.letters[prevIndex];

    this.name = 
      this.name.substring(0, this.cursorPosition) + 
      prevChar + 
      this.name.substring(this.cursorPosition + 1);
  }

  /**
   * Set specific letter at cursor position
   */
  private setLetter(letter: string): void {
    if (this.cursorPosition < 0 || this.cursorPosition >= 4) return;

    this.name = 
      this.name.substring(0, this.cursorPosition) + 
      letter + 
      this.name.substring(this.cursorPosition + 1);
  }

  /**
   * Move cursor to the left
   */
  private moveCursorLeft(): void {
    this.cursorPosition = Math.max(0, this.cursorPosition - 1);
    this.blinkTimer = 0;
    this.blinkVisible = true;
  }

  /**
   * Move cursor to the right
   */
  private moveCursorRight(): void {
    this.cursorPosition = Math.min(3, this.cursorPosition + 1);
    this.blinkTimer = 0;
    this.blinkVisible = true;
  }

  /**
   * Confirm the entered name
   */
  private confirm(): void {
    // Remove event listener
    document.removeEventListener('keydown', (this as any)._handleKeyDown);
    
    // Call callback with the final name
    this.callback(this.name);
  }

  /**
   * Cleanup when component is no longer needed
   */
  dispose(): void {
    document.removeEventListener('keydown', (this as any)._handleKeyDown);
  }
}