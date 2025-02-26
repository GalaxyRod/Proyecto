import Entity from '../Entity';
import { CircularEntity } from '../../utils/Utils';

/**
 * Path pellet that shows ghost paths
 */
export default class PathPellet extends Entity implements CircularEntity {
  private readonly radius: number;

  /**
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Radius
   */
  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this.radius = radius;
  }

  /**
   * Draw the path pellet
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  /**
   * Handle path pellet collection
   * No callback needed as events are now handled by the mediator
   */
  onCollected(): void {
    // No direct callback needed - event is handled by CollisionSystem
  }
  
  /**
   * Get pellet radius
   * @returns {number} Radius
   */
  getRadius(): number {
    return this.radius;
  }
  
  /**
   * Update method (empty as dots don't need updates)
   * Implements abstract method from Entity
   */
  override update(): void {
    // Pellets are static and don't need updating
  }
}