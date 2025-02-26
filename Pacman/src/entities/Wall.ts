import Entity from './Entity';
import { CircularEntity } from '../utils/Utils';
import CollisionDetector from '../game/Collisions/CollisionDetector';
import { Rectangle } from '../types';

/**
 * Wall entity
 */
export default class Wall extends Entity {
  private readonly width: number;
  private readonly height: number;

  /**
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Width
   * @param {number} height - Height
   */
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  /**
   * Draw the wall
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Handle collision with an entity
   * @param {CircularEntity} entity - Entity to check collision with
   */
  handleCollision(entity: CircularEntity): void {
    // Convert the wall to a rectangle
    const wallRect: Rectangle = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
    
    // Convert the entity to a rectangle for collision checking
    const entityRect: Rectangle = {
      x: entity.x - entity.getRadius(),
      y: entity.y - entity.getRadius(),
      width: entity.getRadius() * 2,
      height: entity.getRadius() * 2
    };
    
    // Check collision using our detector
    const collisionInfo = CollisionDetector.getCollisionInfo(entityRect, wallRect);
    
    // If collision occurred, resolve it
    if (collisionInfo.collided) {
      // Get resolution vector
      const resolution = CollisionDetector.getResolutionVector(collisionInfo);
      
      // Apply resolution
      this.resolveCollision(entity, resolution);
    }
  }
  
  /**
   * Resolve a collision by repositioning the entity
   * @param {CircularEntity} entity - Entity to reposition
   * @param {Object} resolution - Resolution vector
   */
  private resolveCollision(
    entity: CircularEntity, 
    resolution: { normalX: number; normalY: number; penetration: number }
  ): void {
    if (resolution.normalX !== 0) {
      // Horizontal collision
      entity.reposition(
        resolution.normalX > 0 ? this.x + this.width + entity.getRadius() + 1 : this.x - entity.getRadius() - 1,
        entity.y
      );
    } else {
      // Vertical collision
      entity.reposition(
        entity.x,
        resolution.normalY > 0 ? this.y + this.height + entity.getRadius() + 1 : this.y - entity.getRadius() - 1
      );
    }
  }
  
  /**
   * Get wall width
   * @returns {number} Width
   */
  getWidth(): number {
    return this.width;
  }
  
  /**
   * Get wall height
   * @returns {number} Height
   */
  getHeight(): number {
    return this.height;
  }

  /**
   * Update method (empty as walls don't need updates)
   * Implements abstract method from Entity
   */
  override update(): void {
    // Walls are static and don't need updating
  }
}