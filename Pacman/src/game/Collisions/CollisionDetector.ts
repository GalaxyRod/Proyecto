import { CircularEntity, RectangularEntity } from '../../utils/Utils';
import { Rectangle, CollisionInfo } from '../../types';

/**
 * A utility class for collision detection
 * Centralizes collision detection logic and provides a more generalized approach
 */
export default class CollisionDetector {
    /**
     * Check if two circles intersect
     * @param {CircularEntity} entity1 - First circular entity
     * @param {CircularEntity} entity2 - Second circular entity
     * @returns {boolean} True if circles intersect
     */
    static circlesIntersect(entity1: CircularEntity, entity2: CircularEntity): boolean {
        const dx = entity1.x - entity2.x;
        const dy = entity1.y - entity2.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        
        const radius1 = entity1.getRadius();
        const radius2 = entity2.getRadius();
        
        return distance < (radius1 + radius2);
    }
    
    /**
     * Check if a circle and rectangle intersect
     * @param {CircularEntity} circle - Circle entity
     * @param {RectangularEntity} rect - Rectangle entity
     * @returns {boolean} True if they intersect
     */
    static circleRectIntersect(circle: CircularEntity, rect: RectangularEntity): boolean {
        // Find the closest point to the circle within the rectangle
        const closestX = Math.max(rect.x - rect.getWidth() / 2, Math.min(circle.x, rect.x + rect.getWidth() / 2));
        const closestY = Math.max(rect.y - rect.getHeight() / 2, Math.min(circle.y, rect.y + rect.getHeight() / 2));
        
        // Calculate the distance between the circle's center and this closest point
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        
        // If the distance is less than the circle's radius, an intersection occurs
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (circle.getRadius() * circle.getRadius());
    }
    
    /**
     * Check if two rectangles intersect
     * @param {Rectangle} rect1 - First rectangle
     * @param {Rectangle} rect2 - Second rectangle
     * @returns {boolean} True if rectangles intersect
     */
    static rectanglesIntersect(rect1: Rectangle, rect2: Rectangle): boolean {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    /**
     * Get detailed collision information between two rectangles
     * @param {Rectangle} rect1 - First rectangle
     * @param {Rectangle} rect2 - Second rectangle
     * @returns {CollisionInfo} Collision information
     */
    static getCollisionInfo(rect1: Rectangle, rect2: Rectangle): CollisionInfo {
        const dx = (rect1.x + rect1.width / 2) - (rect2.x + rect2.width / 2);
        const dy = (rect1.y + rect1.height / 2) - (rect2.y + rect2.height / 2);
        const width = (rect1.width + rect2.width) / 2;
        const height = (rect1.height + rect2.height) / 2;
        
        const crossWidth = width * dy;
        const crossHeight = height * dx;
        const collided = Math.abs(dx) <= width && Math.abs(dy) <= height;
        
        return {
            collided,
            dx,
            dy,
            crossWidth,
            crossHeight
        };
    }
    
    /**
     * Calculate penetration depth and normal for collision resolution
     * @param {CollisionInfo} info - Collision information
     * @returns {Object} Penetration and normal vector
     */
    static getResolutionVector(info: CollisionInfo): { penetration: number; normalX: number; normalY: number } {
        const { crossWidth, crossHeight, dx, dy } = info;
        
        let penetration: number;
        let normalX: number;
        let normalY: number;
        
        // Determine which axis has the shallowest penetration
        if (Math.abs(crossWidth) <= Math.abs(crossHeight)) {
            // X-axis has shallower penetration
            penetration = Math.abs(crossWidth);
            normalX = dx < 0 ? -1 : 1;
            normalY = 0;
        } else {
            // Y-axis has shallower penetration
            penetration = Math.abs(crossHeight);
            normalX = 0;
            normalY = dy < 0 ? -1 : 1;
        }
        
        return { penetration, normalX, normalY };
    }
}