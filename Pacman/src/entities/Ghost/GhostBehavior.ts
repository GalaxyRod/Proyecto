import Node from '../../pathfinding/Node';
import { distanceBetween } from '../../utils/Utils';

/**
 * Interface for ghost behavior strategies
 */
export interface GhostBehavior {
  /**
   * Determine the ghost's destination
   * @param currentPoint - Ghost's current position
   * @param pacmanPoint - Pacman's current position
   * @param isScared - Whether ghost is scared
   * @param getRandomPoint - Function to get a random point
   * @returns The destination node
   */
  determineDestination(
    currentPoint: Node,
    pacmanPoint: Node,
    isScared: boolean,
    getRandomPoint: () => Node
  ): Node;
  
  /**
   * Get the name of the behavior
   * @returns The behavior name
   */
  getName(): string;
}

/**
 * The "Chaser" behavior directly pursues Pacman
 */
export class ChaserBehavior implements GhostBehavior {
  private readonly chaseRadius: number;
  
  /**
   * @param chaseRadius - How close to be to start chasing in tiles
   */
  constructor(chaseRadius: number = 5) {
    this.chaseRadius = chaseRadius;
  }
  
  determineDestination(
    currentPoint: Node,
    pacmanPoint: Node,
    isScared: boolean,
    getRandomPoint: () => Node
  ): Node {
    // If scared, run away (move randomly)
    if (isScared) {
      return getRandomPoint();
    }
    
    // If close enough to pacman, chase directly
    if (distanceBetween(currentPoint, pacmanPoint) <= this.chaseRadius) {
      return pacmanPoint;
    }
    
    // Otherwise move randomly
    return getRandomPoint();
  }
  
  getName(): string {
    return "Chaser";
  }
}

/**
 * The "Ambusher" behavior tries to get ahead of Pacman
 */
export class AmbusherBehavior implements GhostBehavior {
  private readonly chaseRadius: number;
  
  /**
   * @param chaseRadius - How close to be to start ambushing in tiles
   * @param predictionSteps - How many "steps" to look ahead of Pacman (reserved for future implementation)
   */
  constructor(chaseRadius: number = 8, _predictionSteps: number = 4) {
    this.chaseRadius = chaseRadius;
    // Future: implement prediction steps logic
  }
  
  determineDestination(
    currentPoint: Node,
    pacmanPoint: Node,
    isScared: boolean,
    getRandomPoint: () => Node
  ): Node {
    // If scared, run away (move randomly)
    if (isScared) {
      return getRandomPoint();
    }
    
    // If close enough to pacman, try to ambush
    if (distanceBetween(currentPoint, pacmanPoint) <= this.chaseRadius) {
      // Find a node in pacman's vicinity that would be ahead of his direction
      // This is a simplification - in a real implementation, you'd need to know
      // pacman's direction and calculate a point ahead
      const neighbors = pacmanPoint.neighbours.filter(n => n.isPassable);
      
      if (neighbors.length > 0) {
        // Just pick the first passable neighbor as a simple implementation
        return neighbors[0];
      }
      
      // Fallback to chasing directly
      return pacmanPoint;
    }
    
    // Otherwise move randomly
    return getRandomPoint();
  }
  
  getName(): string {
    return "Ambusher";
  }
}

/**
 * The "Patrol" behavior moves between predefined points
 */
export class PatrolBehavior implements GhostBehavior {
  private patrolPoints: Node[];
  private currentPatrolIndex: number;
  private readonly chaseRadius: number;
  
  /**
   * @param patrolPoints - Points to patrol between
   * @param chaseRadius - How close to be to start chasing in tiles
   */
  constructor(patrolPoints: Node[] = [], chaseRadius: number = 3) {
    this.patrolPoints = patrolPoints;
    this.currentPatrolIndex = 0;
    this.chaseRadius = chaseRadius;
  }
  
  determineDestination(
    currentPoint: Node,
    pacmanPoint: Node,
    isScared: boolean,
    getRandomPoint: () => Node
  ): Node {
    // If no patrol points defined, act like a chaser
    if (this.patrolPoints.length === 0) {
      if (isScared) {
        return getRandomPoint();
      } else if (distanceBetween(currentPoint, pacmanPoint) <= this.chaseRadius) {
        return pacmanPoint;
      } else {
        return getRandomPoint();
      }
    }
    
    // If scared, run away (move randomly)
    if (isScared) {
      return getRandomPoint();
    }
    
    // If very close to pacman, chase directly
    if (distanceBetween(currentPoint, pacmanPoint) <= this.chaseRadius) {
      return pacmanPoint;
    }
    
    // Otherwise follow patrol pattern
    const target = this.patrolPoints[this.currentPatrolIndex];
    
    // If we've reached the current patrol point, move to the next one
    if (currentPoint === target) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
      return this.patrolPoints[this.currentPatrolIndex];
    }
    
    return target;
  }
  
  /**
   * Set patrol points
   * @param points - New patrol points
   */
  setPatrolPoints(points: Node[]): void {
    this.patrolPoints = points;
    this.currentPatrolIndex = 0;
  }
  
  /**
   * Add a patrol point
   * @param point - Point to add
   */
  addPatrolPoint(point: Node): void {
    this.patrolPoints.push(point);
  }
  
  getName(): string {
    return "Patrol";
  }
}