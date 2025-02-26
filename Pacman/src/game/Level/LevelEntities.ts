import Wall from '../../entities/Wall';
import Dot from '../../entities/Dot';
import Ghost from '../../entities/Ghost/Ghost';
import PowerPellet from '../../entities/Pellets/PowerPellet';
import PathPellet from '../../entities/Pellets/PathPellet';
import Node from '../../pathfinding/Node';

/**
 * Holds the game entities for a level during loading
 */
export class LevelEntities {
  walls: Wall[] = [];
  dots: Dot[] = [];
  ghosts: Ghost[] = [];
  pellets: (PowerPellet | PathPellet)[] = [];
  startNode: Node | null = null;
  
  /**
   * Add a wall entity
   * @param {Wall} wall - Wall to add
   */
  addWall(wall: Wall): void {
    this.walls.push(wall);
  }
  
  /**
   * Add a dot entity
   * @param {Dot} dot - Dot to add
   */
  addDot(dot: Dot): void {
    this.dots.push(dot);
  }
  
  /**
   * Add a ghost entity
   * @param {Ghost} ghost - Ghost to add
   */
  addGhost(ghost: Ghost): void {
    this.ghosts.push(ghost);
  }
  
  /**
   * Add a pellet entity
   * @param {PowerPellet|PathPellet} pellet - Pellet to add
   */
  addPellet(pellet: PowerPellet | PathPellet): void {
    this.pellets.push(pellet);
  }
  
  /**
   * Set the start node
   * @param {Node} node - Start node
   */
  setStartNode(node: Node): void {
    this.startNode = node;
  }
  
  /**
   * Get count of all entities
   * @returns {number} Total entity count
   */
  getTotalEntityCount(): number {
    return this.walls.length + this.dots.length + 
           this.ghosts.length + this.pellets.length;
  }
  
  /**
   * Check if there are any entities
   * @returns {boolean} True if there are entities
   */
  hasEntities(): boolean {
    return this.getTotalEntityCount() > 0;
  }
}