import Dot from '../entities/Dot';
import Wall from '../entities/Wall';
import Ghost from '../entities/Ghost/Ghost';
import PowerPellet from '../entities/Pellets/PowerPellet';
import PathPellet from '../entities/Pellets/PathPellet';
import Node from '../pathfinding/Node';

/**
 * Interface that defines what systems need from Level
 * Following Law of Demeter by limiting knowledge to direct collaborators
 */
export interface LevelAccessor {
    /**
     * Get all dots in the level
     * @returns {Dot[]} Array of dots
     */
    getDots(): Dot[];
    
    /**
     * Get all walls in the level
     * @returns {Wall[]} Array of walls
     */
    getWalls(): Wall[];
    
    /**
     * Get all ghosts in the level
     * @returns {Ghost[]} Array of ghosts
     */
    getGhosts(): Ghost[];
    
    /**
     * Get all pellets in the level
     * @returns {(PowerPellet|PathPellet)[]} Array of pellets
     */
    getPellets(): (PowerPellet | PathPellet)[];
    
    /**
     * Remove a dot from the level
     * @param {Dot} dot - Dot to remove
     */
    removeDot(dot: Dot): void;
    
    /**
     * Remove a pellet from the level
     * @param {PowerPellet|PathPellet} pellet - Pellet to remove
     */
    removePellet(pellet: PowerPellet | PathPellet): void;
    
    /**
     * Remove a ghost from the level
     * @param {Ghost} ghost - Ghost to remove
     */
    removeGhost(ghost: Ghost): void;
    
    /**
     * Add a ghost to the level
     * @param {Ghost} ghost - Ghost to add
     */
    addGhost(ghost: Ghost): void;
    
    /**
     * Get the starting node
     * @returns {Node | null} Starting node
     */
    getStartNode(): Node | null;
    
    /**
     * Get tile size
     * @returns {number} Tile size
     */
    getTileSize(): number;
    
    /**
     * Get a random passable point in the level
     * @returns {Node} Random passable node
     */
    getRandomPoint(): Node;
    
    /**
     * Get the node at a given position in screen coordinates
     * @param {number} x - X screen coordinate
     * @param {number} y - Y screen coordinate
     * @returns {Node} Node at the given position
     */
    getPoint(x: number, y: number): Node;
    
    /**
     * Check if level is completed (all dots collected)
     * @returns {boolean} True if level is completed
     */
    isCompleted(): boolean;
}