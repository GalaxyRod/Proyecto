/**
 * Animation component for mouth animation
 */
export class MouthAnimationComponent {
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
      if (this.direction === 1) {
        this.angle += this.speed;
      } else {
        this.angle -= this.speed;
      }
      
      if (this.angle > (1 - this.gap) || this.angle < 0) {
        this.direction *= -1;
      }
    }
    
    /**
     * Get current angle
     * @returns {number} Current angle
     */
    getAngle(): number {
      return this.angle;
    }
    
    /**
     * Set animation speed
     * @param {number} speed - New speed
     */
    setSpeed(speed: number): void {
      this.speed = speed;
    }
    
    /**
     * Set gap size
     * @param {number} gap - New gap size
     */
    setGap(gap: number): void {
      this.gap = gap;
    }
  }