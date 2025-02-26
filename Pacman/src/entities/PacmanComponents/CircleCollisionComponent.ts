import { CollisionComponent, PositionComponent } from "../../types";
import Entity from "../Entity";

/**
 * Handles circular collision checking
 */
export class CircleCollisionComponent implements CollisionComponent {
    private radius: number;
    private readonly position: PositionComponent;
    
    /**
     * @param {PositionComponent} position - Position component
     * @param {number} radius - Collision radius
     */
    constructor(position: PositionComponent, radius: number) {
      this.position = position;
      this.radius = radius;
    }
    
    /**
     * Check collision with another entity
     * @param {Entity} other - Other entity to check
     * @returns {boolean} True if collision detected
     */
    checkCollision(other: Entity): boolean {
      if (!other.hasComponent('collision')) return false;
      
      const otherCollision = other.getComponent<CollisionComponent>('collision');
      if (!otherCollision) return false;
      
      const otherShape = otherCollision.getCollisionShape();
      
      if ('radius' in otherShape) {
        // Circle-circle collision
        const dx = this.position.x - otherShape.x;
        const dy = this.position.y - otherShape.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        return distance < (this.radius + otherShape.radius);
      }
      
      // For other shapes, we'd need specific implementations
      return false;
    }
    
    /**
     * Get collision shape
     * @returns {Object} Circle shape
     */
    getCollisionShape(): { x: number; y: number; radius: number } {
      return {
        x: this.position.x,
        y: this.position.y,
        radius: this.radius
      };
    }
    
    /**
     * Set radius
     * @param {number} radius - New radius
     */
    setRadius(radius: number): void {
      this.radius = radius;
    }
    
    /**
     * Get radius
     * @returns {number} Current radius
     */
    getRadius(): number {
      return this.radius;
    }
  }