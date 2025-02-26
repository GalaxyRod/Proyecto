/**
 * Handles Pacman's mouth animation
 */
export default class MouthAnimation {
    private speed: number;
    private gap: number;
    private angle: number;
    private direction: number;
  
    /**
     * @param {number} speed - Animation speed
     * @param {number} gap - Maximum mouth gap
     */
    constructor(speed: number = 0.05, gap: number = 0.3) {
      this.speed = speed;
      this.gap = gap;
      this.angle = 0;
      this.direction = 1;
    }
  
    /**
     * Update the animation state
     */
    update(): void {
      // Depending on direction, the mouth will open or close
      if (this.direction === 1) {
        this.angle += this.speed;
      } else {
        this.angle -= this.speed;
      }
      
      // Stop it on the way back so it doesn't go back around the full circle
      if (this.angle > (1 - this.gap) || this.angle < 0) {
        this.direction *= -1; // switch direction
      }
    }
  
    /**
     * Get current animation angle
     * @returns {number} Current animation angle
     */
    getAngle(): number {
      return this.angle;
    }
  
    /**
     * Set animation speed
     * @param {number} speed - New animation speed
     */
    setSpeed(speed: number): void {
      this.speed = speed;
    }
  
    /**
     * Set maximum mouth gap
     * @param {number} gap - New gap value
     */
    setGap(gap: number): void {
      this.gap = gap;
    }
  }