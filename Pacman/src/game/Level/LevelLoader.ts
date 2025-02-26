import Level from './Level';
import { LevelConfig } from '../../types/LevelConfig';
import Node from '../../pathfinding/Node';
import Wall from '../../entities/Wall';
import Dot from '../../entities/Dot';
import GhostFactory from '../../entities/Ghost/GhostFactory';
import PowerPellet from '../../entities/Pellets/PowerPellet';
import PathPellet from '../../entities/Pellets/PathPellet';
import { exists } from '../../utils/Utils';
import Pacman from '../../entities/Pacman';
import { LevelEntities } from './LevelEntities';
import ErrorHandler from '../../utils/Errors/ErrorHandler';
import { GameErrorType } from '../../enums';
import { GameError } from '../../utils/Errors/GameError';

/**
 * Handles loading level data and constructing the level
 */
export default class LevelLoader {
    private readonly levelData: string;
    private readonly tileSize: number;
    
    /**
     * @param {string} levelData - Level data as string
     * @param {number} canvasWidth - Canvas width for calculating tile size
     */
    constructor(levelData: string, canvasWidth: number) {
        if (!levelData) {
            throw new GameError(
                GameErrorType.LevelLoadError,
                'Level data is empty or invalid'
            );
        }
        
        this.levelData = levelData;
        
        // Calculate tile size based on canvas width and level width
        const rows = this.levelData.split("\n");
        const levelWidth = rows[0]?.length || 0;
        
        if (levelWidth <= 0) {
            throw new GameError(
                GameErrorType.LevelLoadError,
                'Invalid level format: level has no width'
            );
        }
        
        this.tileSize = canvasWidth / levelWidth;
    }
    
    /**
     * Load level from file
     * @param {string} levelPath - Path to level file
     * @param {number} canvasWidth - Canvas width
     * @returns {Promise<LevelLoader>} Level loader with loaded data
     */
    static async fromFile(levelPath: string, canvasWidth: number): Promise<LevelLoader> {
        try {
            const response = await fetch(levelPath);
            
            // Check if the response was successful
            if (!response.ok) {
                throw new GameError(
                    GameErrorType.LevelLoadError,
                    `Failed to fetch level: HTTP ${response.status} ${response.statusText}`
                );
            }
            
            const levelData = await response.text();
            
            // Validate level data
            if (!levelData || levelData.trim() === '') {
                throw new GameError(
                    GameErrorType.LevelLoadError,
                    'Empty level data received'
                );
            }
            
            return new LevelLoader(levelData, canvasWidth);
        } catch (error) {
            // Handle network errors differently from parsing errors
            if (error instanceof GameError) {
                ErrorHandler.logError(error);
                throw error;
            } else {
                const gameError = ErrorHandler.handleLevelLoadError(
                    error as Error, 
                    levelPath
                );
                ErrorHandler.logError(gameError);
                throw gameError;
            }
        }
    }
    
    /**
     * Get level string data
     * @returns {string} Level data
     */
    getLevelData(): string {
        return this.levelData;
    }
    
    /**
     * Get calculated tile size
     * @returns {number} Tile size
     */
    getTileSize(): number {
        return this.tileSize;
    }
    
    /**
     * Build level
     * @param {Pacman} pacman - Pacman entity to position
     * @returns {Level} Built level
     */
    buildLevel(pacman: Pacman): Level {
        try {
            // Validate level dimensions
            const rows = this.levelData.split("\n");
            this.validateLevelDimensions(rows);
            
            // Create graph and process tiles
            const { graph, entities } = this.createGraphAndEntities(rows, pacman);
            
            // Connect nodes
            this.connectNodes(graph, rows);
            
            // Ensure the level has a start node
            if (!entities.startNode) {
                throw new GameError(
                    GameErrorType.LevelLoadError,
                    'Level has no starting point (S)'
                );
            }
            
            // Create level config object
            const levelConfig: LevelConfig = {
                levelData: this.levelData,
                graph,
                startNode: entities.startNode,
                tileSize: this.tileSize,
                walls: entities.walls,
                dots: entities.dots,
                ghosts: entities.ghosts,
                pellets: entities.pellets
            };
            
            // Create and return level instance
            return new Level(levelConfig);
        } catch (error) {
            // Handle building errors
            if (error instanceof GameError) {
                ErrorHandler.logError(error);
                throw error;
            } else {
                const gameError = new GameError(
                    GameErrorType.LevelLoadError,
                    `Error building level: ${(error as Error).message}`,
                    error as Error
                );
                ErrorHandler.logError(gameError);
                throw gameError;
            }
        }
    }
    
    /**
     * Validate level dimensions
     * @param {string[]} rows - Level rows
     */
    private validateLevelDimensions(rows: string[]): void {
        // Check for irregular row lengths
        const firstRowLength = rows[0].length;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].length !== firstRowLength) {
                throw new GameError(
                    GameErrorType.LevelLoadError,
                    `Irregular level format: row ${i} has different length (${rows[i].length}) than first row (${firstRowLength})`
                );
            }
        }
        
        // Check minimum size
        if (rows.length < 3 || firstRowLength < 3) {
            throw new GameError(
                GameErrorType.LevelLoadError,
                `Level is too small: ${firstRowLength}x${rows.length} (minimum size is 3x3)`
            );
        }
    }
    
    /**
     * Create graph nodes and entities
     * @param {string[]} rows - Level rows
     * @param {Pacman} pacman - Pacman entity
     * @returns {Object} Graph and entities
     */
    private createGraphAndEntities(
        rows: string[], 
        pacman: Pacman
    ): { graph: Map<string, Node>; entities: LevelEntities } {
        const graph = new Map<string, Node>();
        const entities = new LevelEntities();
        
        // Process each tile in the level
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                const char = rows[i][j];
                
                // Create node
                const passable = char !== "#"; // Walls are NOT passable
                const node = new Node(passable, j, i);
                
                // Add the node to the graph
                graph.set(`${j} ${i}`, node);
                
                // Process tile character
                this.processTileCharacter(char, j, i, entities, pacman);
                
                // Save start node
                if (char === "S") {
                    entities.setStartNode(node);
                }
            }
        }
        
        return { graph, entities };
    }
    
    /**
     * Process a character in the level data and create appropriate entities
     * @param {string} char - Character from level file
     * @param {number} x - X coordinate in grid
     * @param {number} y - Y coordinate in grid
     * @param {LevelEntities} entities - Entity collections
     * @param {Pacman} pacman - Pacman entity to position
     */
    private processTileCharacter(
        char: string,
        x: number,
        y: number,
        entities: LevelEntities,
        pacman: Pacman
    ): void {
        try {
            // Calculate center position in pixels
            const posX = x * this.tileSize + this.tileSize / 2;
            const posY = y * this.tileSize + this.tileSize / 2;
            
            switch (char) {
                case "S": // Starting position
                    pacman.resize((this.tileSize / 2) * 0.8);
                    pacman.stop();
                    pacman.reposition(posX, posY);
                    break;
                    
                case ".": // Dot
                    entities.addDot(
                        new Dot(posX, posY, (this.tileSize / 2) * 0.15)
                    );
                    break;
                    
                case "#": // Wall
                    entities.addWall(
                        new Wall(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize)
                    );
                    break;
                    
                case "G": // Regular Ghost
                    entities.addGhost(
                        GhostFactory.createChaser(
                            posX, posY, (this.tileSize / 2) * 0.5
                        )
                    );
                    break;
                    
                case "A": // Ambusher Ghost
                    entities.addGhost(
                        GhostFactory.createAmbusher(
                            posX, posY, (this.tileSize / 2) * 0.5
                        )
                    );
                    break;
                    
                case "R": // Random Ghost
                    entities.addGhost(
                        GhostFactory.createRandom(
                            posX, posY, (this.tileSize / 2) * 0.5
                        )
                    );
                    break;
                    
                case "H": // Path Pellet
                    entities.addPellet(
                        new PathPellet(posX, posY, (this.tileSize / 2) * 0.40)
                    );
                    break;
                    
                case "P": // Power Pellet
                    entities.addPellet(
                        new PowerPellet(posX, posY, (this.tileSize / 2) * 0.40)
                    );
                    break;
                    
                case " ": // Empty space
                    // Nothing to do
                    break;
                    
                default:
                    console.warn(`Unknown character '${char}' at position (${x}, ${y})`);
                    break;
            }
        } catch (error) {
            throw new GameError(
                GameErrorType.LevelLoadError,
                `Error processing character '${char}' at (${x}, ${y}): ${(error as Error).message}`,
                error as Error
            );
        }
    }
    
    /**
     * Connect nodes with their neighbors
     * @param {Map<string, Node>} graph - Graph to connect
     * @param {string[]} rows - Level rows
     */
    private connectNodes(graph: Map<string, Node>, rows: string[]): void {
        try {
            for (let i = 0; i < rows.length; i++) {
                for (let j = 0; j < rows[i].length; j++) {
                    const node = graph.get(`${j} ${i}`);
                    if (!node) continue;
                    
                    const neighbors = [
                        graph.get(`${j} ${i - 1}`),  // above
                        graph.get(`${j - 1} ${i}`),  // left
                        graph.get(`${j + 1} ${i}`),  // right
                        graph.get(`${j} ${i + 1}`)   // below
                    ];
                    
                    neighbors.forEach(n => {
                        if (exists(n)) {
                            node.neighbours.push(n);
                        }
                    });
                }
            }
        } catch (error) {
            throw new GameError(
                GameErrorType.LevelLoadError,
                `Error connecting nodes: ${(error as Error).message}`,
                error as Error
            );
        }
    }
}