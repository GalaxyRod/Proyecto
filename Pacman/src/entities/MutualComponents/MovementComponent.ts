import { PhysicsComponent, PositionComponent, Speed } from '../../types';

/**
 * Default physics component for moving entities
 */
export class MovementComponent implements PhysicsComponent {
  private readonly speed: Speed;
  private readonly position: PositionComponent;
  
  /**
   * @param {PositionComponent} position - Position component
   * @param {number} initialMagnitude - Initial speed magnitude
   */
  constructor(position: PositionComponent, initialMagnitude: number = 0) {
    this.position = position;
    this.speed = {
      dx: 0,
      dy: 0,
      magnitude: initialMagnitude
    };
  }
  
  /**
   * Update position based on speed
   */
  update(): void {
    this.position.x += this.speed.dx;
    this.position.y += this.speed.dy;
  }
  
  /**
   * Set speed components
   * @param {number} dx - X speed component
   * @param {number} dy - Y speed component
   */
  setSpeed(dx: number, dy: number): void {
    this.speed.dx = dx;
    this.speed.dy = dy;
  }
  
  /**
   * Set movement in a direction
   * @param {string} direction - Direction (UP, DOWN, LEFT, RIGHT)
   */
  moveInDirection(direction: string): void {
    if (direction === "UP") {
      this.speed.dx = 0;
      this.speed.dy = -this.speed.magnitude;
    } else if (direction === "DOWN") {
      this.speed.dx = 0;
      this.speed.dy = this.speed.magnitude;
    } else if (direction === "LEFT") {
      this.speed.dx = -this.speed.magnitude;
      this.speed.dy = 0;
    } else if (direction === "RIGHT") {
      this.speed.dx = this.speed.magnitude;
      this.speed.dy = 0;
    }
  }
  
  /**
   * Stop movement
   */
  stop(): void {
    this.speed.dx = 0;
    this.speed.dy = 0;
  }
  
  /**
   * Set speed magnitude
   * @param {number} magnitude - New magnitude
   */
  setMagnitude(magnitude: number): void {
    this.speed.magnitude = magnitude;
    
    // Update current velocity to match new magnitude
    if (this.speed.dx !== 0) {
      this.speed.dx = this.speed.dx > 0 ? magnitude : -magnitude;
    }
    
    if (this.speed.dy !== 0) {
      this.speed.dy = this.speed.dy > 0 ? magnitude : -magnitude;
    }
  }
  
  /**
   * Get current speed
   * @returns {Speed} Current speed
   */
  getSpeed(): Speed {
    return { ...this.speed };
  }
  
  /**
   * Get current direction
   * @returns {string} Current direction
   */
  getDirection(): string {
    if (this.speed.dx > 0) return "RIGHT";
    if (this.speed.dx < 0) return "LEFT";
    if (this.speed.dy > 0) return "DOWN";
    if (this.speed.dy < 0) return "UP";
    return "NONE";
  }
}
