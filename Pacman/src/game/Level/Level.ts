import Node from '../../pathfinding/Node';
import Wall from '../../entities/Wall';
import Dot from '../../entities/Dot';
import Ghost from '../../entities/Ghost/Ghost';
import PowerPellet from '../../entities/Pellets/PowerPellet';
import PathPellet from '../../entities/Pellets/PathPellet';
import { exists } from '../../utils/Utils';
import { LevelConfig } from '../../types/LevelConfig';
import { GameError } from '../../utils/Errors/GameError';
import { GameErrorType } from '../../enums';
import { LevelAccessor } from '../../types/LevelAccessor';
import { EntityCollections } from '../../types/EntityCollections';

/**
 * Level class for managing the game level, implements LevelAccessor interface
 */
export default class Level implements LevelAccessor {
  private readonly levelData: string;
  private readonly graph: Map<string, Node>;
  private readonly startNode: Node | null;
  private readonly tileSize: number;
  private readonly entities: EntityCollections;
  
  /**
   * @param {LevelConfig} config - Level configuration object
   */
  constructor(config: LevelConfig) {
    this.levelData = config.levelData;
    this.graph = config.graph;
    this.startNode = config.startNode;
    this.tileSize = config.tileSize;
    
    // Store entities in a structured object
    this.entities = {
      walls: config.walls,
      dots: config.dots,
      ghosts: config.ghosts,
      pellets: config.pellets
    };
  }

  /**
   * Get a node from the graph
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Node | undefined} Node at the given coordinates
   */
  getNode(x: number, y: number): Node | undefined {
    return this.graph.get(`${Math.floor(x)} ${Math.floor(y)}`);
  }

  /**
   * Get the starting node
   * @returns {Node | null} Starting node
   */
  getStartNode(): Node | null {
    return this.startNode;
  }

  /**
   * Get a random passable point in the level
   * @returns {Node} Random passable node
   * @throws {GameError} If no passable point can be found
   */
  getRandomPoint(): Node {
    const rows = this.levelData.split('\n');
    const maxX = rows[0]?.length || 0;
    const maxY = rows.length;
    
    // Safety check to avoid invalid level data
    if (maxX === 0 || maxY === 0) {
      throw new GameError(
        GameErrorType.InvalidStateError,
        "Invalid level data: level has no content"
      );
    }
    
    let point: Node | undefined;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loop
    
    do {
      const x = Math.floor(Math.random() * maxX);
      const y = Math.floor(Math.random() * maxY);
      point = this.getNode(x, y);
      attempts++;
      
      if (attempts >= maxAttempts) {
        throw new GameError(
          GameErrorType.PathfindingError,
          "Failed to find a random passable point after many attempts"
        );
      }
    } while (!exists(point) || !point.isPassable);
    
    return point;
  }

  /**
   * Get the node at a given position in screen coordinates
   * @param {number} x - X screen coordinate
   * @param {number} y - Y screen coordinate
   * @returns {Node} Node at the given position
   * @throws {GameError} If no node is found
   */
  getPoint(x: number, y: number): Node {
    const node = this.getNode(x / this.tileSize, y / this.tileSize);
    if (!node) {
      throw new GameError(
        GameErrorType.PathfindingError,
        `No node found at position (${x}, ${y})`
      );
    }
    return node;
  }

  /**
   * Get walls
   * @returns {Array<Wall>} Walls
   */
  getWalls(): Wall[] {
    return this.entities.walls;
  }

  /**
   * Get dots
   * @returns {Array<Dot>} Dots
   */
  getDots(): Dot[] {
    return this.entities.dots;
  }

  /**
   * Get ghosts
   * @returns {Array<Ghost>} Ghosts
   */
  getGhosts(): Ghost[] {
    return this.entities.ghosts;
  }

  /**
   * Get pellets
   * @returns {Array<PowerPellet|PathPellet>} Pellets
   */
  getPellets(): (PowerPellet | PathPellet)[] {
    return this.entities.pellets;
  }

  /**
   * Get tile size
   * @returns {number} Tile size
   */
  getTileSize(): number {
    return this.tileSize;
  }
  
  /**
   * Remove a dot from the level
   * @param {Dot} dot - Dot to remove
   */
  removeDot(dot: Dot): void {
    const index = this.entities.dots.indexOf(dot);
    if (index !== -1) {
      this.entities.dots.splice(index, 1);
    }
  }
  
  /**
   * Remove a pellet from the level
   * @param {PowerPellet|PathPellet} pellet - Pellet to remove
   */
  removePellet(pellet: PowerPellet | PathPellet): void {
    const index = this.entities.pellets.indexOf(pellet);
    if (index !== -1) {
      this.entities.pellets.splice(index, 1);
    }
  }
  
  /**
   * Remove a ghost from the level
   * @param {Ghost} ghost - Ghost to remove
   */
  removeGhost(ghost: Ghost): void {
    const index = this.entities.ghosts.indexOf(ghost);
    if (index !== -1) {
      this.entities.ghosts.splice(index, 1);
    }
  }
  
  /**
   * Add a ghost to the level
   * @param {Ghost} ghost - Ghost to add
   */
  addGhost(ghost: Ghost): void {
    this.entities.ghosts.push(ghost);
  }
  
  /**
   * Check if level is completed (all dots collected)
   * @returns {boolean} True if level is completed
   */
  isCompleted(): boolean {
    return this.entities.dots.length === 0;
  }
  
  /**
   * Get all entities in the level
   * @returns {EntityCollections} All entities
   */
  getAllEntities(): EntityCollections {
    return this.entities;
  }
  
  /**
   * Get all entities at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Search radius
   * @returns {any[]} Array of entities
   */
  getEntitiesAt(x: number, y: number, radius: number = 0): any[] {
    const result: any[] = [];
    const checkDistance = (entity: any) => {
      if ('x' in entity && 'y' in entity) {
        const dx = entity.x - x;
        const dy = entity.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= radius;
      }
      return false;
    };
    
    result.push(...this.entities.walls.filter(checkDistance));
    result.push(...this.entities.dots.filter(checkDistance));
    result.push(...this.entities.ghosts.filter(checkDistance));
    result.push(...this.entities.pellets.filter(checkDistance));
    
    return result;
  }
}