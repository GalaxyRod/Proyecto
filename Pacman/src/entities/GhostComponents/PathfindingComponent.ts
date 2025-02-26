import { PositionComponent } from "../../types";
import { GhostBehavior } from "../Ghost/GhostBehavior";
import Node from '../../pathfinding/Node';
import PathFinder from "../../pathfinding/PathFinder";

/**
 * Interface for controlling movement direction
 * Used to follow Law of Demeter
 */
interface MovementController {
  moveInDirection(direction: string): void;
}

/**
 * Ghost pathfinding component
 */
export class PathfindingComponent {
  private readonly position: PositionComponent;
  private readonly movementController: MovementController;
  private path: Node[];
  private destination: Node | null;
  private currentPoint: Node | null;
  private currentTarget: Node | null;
  private updateFrequency: number;
  private lastUpdate: number;
  
  /**
   * @param {PositionComponent} position - Position component
   * @param {MovementController} movementController - Movement controller for direction changes
   * @param {number} updateFrequency - How often to update pathfinding
   */
  constructor(
    position: PositionComponent,
    movementController: MovementController,
    updateFrequency: number = 30
  ) {
    this.position = position;
    this.movementController = movementController;
    this.path = [];
    this.destination = null;
    this.currentPoint = null;
    this.currentTarget = null;
    this.updateFrequency = updateFrequency;
    this.lastUpdate = 0;
  }
  
  /**
   * Update pathfinding
   * @param {Function} getPoint - Function to get point from coordinates
   * @param {Function} getRandomPoint - Function to get random point
   * @param {Node} pacmanPoint - Pacman's current position
   * @param {boolean} isScared - Whether ghost is scared
   * @param {GhostBehavior} behavior - Ghost behavior
   */
  update(
    getPoint: (x: number, y: number) => Node,
    getRandomPoint: () => Node,
    pacmanPoint: Node,
    isScared: boolean,
    behavior: GhostBehavior
  ): void {
    // Update current position
    this.currentPoint = getPoint(this.position.x, this.position.y);
    this.lastUpdate++;
    
    // Only update path-finding logic occasionally for performance
    if (this.lastUpdate >= this.updateFrequency) {
      this.lastUpdate = 0;
      this.updatePathfinding(getPoint, getRandomPoint, pacmanPoint, isScared, behavior);
    }
  }
  
  /**
   * Update the ghost's pathfinding logic
   * @param {Function} _getPoint - Function to get a point from coordinates
   * @param {Function} getRandomPoint - Function to get a random point
   * @param {Node} pacmanPoint - Pacman's current position
   * @param {boolean} isScared - Whether ghost is scared
   * @param {GhostBehavior} behavior - Ghost behavior
   */
  private updatePathfinding(
    _getPoint: (x: number, y: number) => Node,
    getRandomPoint: () => Node,
    pacmanPoint: Node,
    isScared: boolean,
    behavior: GhostBehavior
  ): void {
    // Skip pathfinding if we don't have a current point
    if (!this.currentPoint) return;
    
    // Use the behavior strategy to determine destination
    this.destination = behavior.determineDestination(
      this.currentPoint,
      pacmanPoint,
      isScared,
      getRandomPoint
    );
    
    // Calculate path to destination
    if (this.destination) {
      this.path = PathFinder.constructPathBFS(this.currentPoint, this.destination);
      this.moveToNextNode(getRandomPoint);
    }
  }
  
  /**
   * Move to the next node in the calculated path
   * @param {Function} getRandomPoint - Function to get a random point
   */
  private moveToNextNode(getRandomPoint: () => Node): void {
    if (!this.currentPoint) return;
    
    if (this.path.length >= 2) {
      // There's more path to go, move to the next node
      this.currentTarget = this.path[1];
    } else {
      // Already at the target or no valid path
      this.currentTarget = this.path[0] || this.currentPoint;
      this.destination = getRandomPoint(); // Pick a new random destination
    }
    
    // Determine which direction to move
    this.determineMovementDirection();
  }
  
  /**
   * Determine which direction to move based on current target
   */
  private determineMovementDirection(): void {
    if (!this.currentTarget || !this.currentPoint || this.currentTarget === this.currentPoint) {
      return;
    }
    
    let direction = "NONE";
    
    if (this.currentTarget.x > this.currentPoint.x) {
      direction = "RIGHT";
    } else if (this.currentTarget.x < this.currentPoint.x) {
      direction = "LEFT";
    } else if (this.currentTarget.y < this.currentPoint.y) {
      direction = "UP";
    } else if (this.currentTarget.y > this.currentPoint.y) {
      direction = "DOWN";
    }
    
    if (direction !== "NONE") {
      this.movementController.moveInDirection(direction);
    }
  }
  
  /**
   * Get current path
   * @returns {Node[]} Current path
   */
  getPath(): Node[] {
    return this.path;
  }
  
  /**
   * Iterate through each node in the path
   * Added to follow Law of Demeter when accessing path nodes
   * @param {Function} callback - Function to call for each node
   */
  forEachPathNode(callback: (node: Node) => void): void {
    this.path.forEach(callback);
  }
  
  /**
   * Set update frequency
   * @param {number} frequency - Update frequency
   */
  setUpdateFrequency(frequency: number): void {
    this.updateFrequency = Math.max(1, frequency);
  }
  
  /**
   * Set destination
   * @param {Node} destination - Destination node
   */
  setDestination(destination: Node): void {
    this.destination = destination;
  }
  
  /**
   * Get the current destination
   * @returns {Node|null} Current destination node
   */
  getDestination(): Node | null {
    return this.destination;
  }
  
  /**
   * Check if a path exists
   * @returns {boolean} True if there is a valid path
   */
  hasPath(): boolean {
    return this.path.length > 0;
  }
  
  /**
   * Get path length
   * @returns {number} Path length
   */
  getPathLength(): number {
    return this.path.length;
  }
}