import Ghost from './Ghost';
import { 
  ChaserBehavior, 
  AmbusherBehavior, 
  PatrolBehavior 
} from './GhostBehavior';
import Node from '../../pathfinding/Node';

/**
 * Factory for creating different types of ghosts
 */
export default class GhostFactory {
  /**
   * Create a chaser ghost (aggressively pursues Pacman)
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} size - Size (for both width and height)
   * @param {number} chaseRadius - Chase radius in tiles
   * @returns {Ghost} Chaser ghost
   */
  static createChaser(
    x: number, 
    y: number, 
    size: number, 
    chaseRadius: number = 5
  ): Ghost {
    return new Ghost(
      x, y, size, size, 
      'red', // Red for chasers
      new ChaserBehavior(chaseRadius)
    );
  }

  /**
   * Create an ambusher ghost (tries to get ahead of Pacman)
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} size - Size (for both width and height)
   * @param {number} chaseRadius - Chase radius in tiles
   * @param {number} predictionSteps - Steps to look ahead
   * @returns {Ghost} Ambusher ghost
   */
  static createAmbusher(
    x: number, 
    y: number, 
    size: number, 
    chaseRadius: number = 8,
    predictionSteps: number = 4
  ): Ghost {
    return new Ghost(
      x, y, size, size, 
      'pink', // Pink for ambushers
      new AmbusherBehavior(chaseRadius, predictionSteps)
    );
  }

  /**
   * Create a patrol ghost (patrols between points)
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} size - Size (for both width and height)
   * @param {Node[]} patrolPoints - Points to patrol between
   * @param {number} chaseRadius - Chase radius in tiles
   * @returns {Ghost} Patrol ghost
   */
  static createPatrol(
    x: number, 
    y: number, 
    size: number, 
    patrolPoints: Node[] = [],
    chaseRadius: number = 3
  ): Ghost {
    return new Ghost(
      x, y, size, size, 
      'orange', // Orange for patrol ghosts
      new PatrolBehavior(patrolPoints, chaseRadius)
    );
  }

  /**
   * Create a random ghost (randomly moves around)
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} size - Size (for both width and height)
   * @returns {Ghost} Random ghost
   */
  static createRandom(
    x: number, 
    y: number, 
    size: number
  ): Ghost {
    return new Ghost(
      x, y, size, size, 
      'cyan', // Cyan for random ghosts
      // Use chaser with radius 0 to always random
      new ChaserBehavior(0)
    );
  }
}