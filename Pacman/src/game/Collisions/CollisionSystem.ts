import AudioManager from '../../utils/Managers/AudioManager';
import Pacman from '../../entities/Pacman';
import Ghost from '../../entities/Ghost/Ghost';
import PowerPellet from '../../entities/Pellets/PowerPellet';
import PathPellet from '../../entities/Pellets/PathPellet';
import Dot from '../../entities/Dot';
import Wall from '../../entities/Wall';
import EventMediator from '../EventMediator';
import CollisionDetector from './CollisionDetector';
import { GameEventType } from '../../enums';
import { LevelAccessor } from '../../types/LevelAccessor';

/**
 * System for handling collisions
 */
export default class CollisionSystem {
    private readonly levelAccessor: LevelAccessor;
    private readonly pacman: Pacman;
    private readonly audioManager: AudioManager;
    private readonly eventMediator: EventMediator;

    /**
     * @param {LevelAccessor} levelAccessor - Interface to access level data
     * @param {Pacman} pacman - Pacman entity
     * @param {AudioManager} audioManager - Audio manager
     * @param {EventMediator} eventMediator - Event mediator for notifications
     */
    constructor(
        levelAccessor: LevelAccessor,
        pacman: Pacman,
        audioManager: AudioManager,
        eventMediator: EventMediator
    ) {
        this.levelAccessor = levelAccessor;
        this.pacman = pacman;
        this.audioManager = audioManager;
        this.eventMediator = eventMediator;
    }

    /**
     * Update collision detection
     * @param {boolean} ghostsScared - Whether ghosts are scared
     */
    update(ghostsScared: boolean): void {
        // Get entities from level through accessor interface
        const dots = this.levelAccessor.getDots();
        const walls = this.levelAccessor.getWalls();
        const ghosts = this.levelAccessor.getGhosts();
        const pellets = this.levelAccessor.getPellets();

        // Handle dot collisions
        this.handleDotCollisions(dots);

        // Handle wall collisions
        this.handleWallCollisions(walls);

        // Handle pellet collisions
        this.handlePelletCollisions(pellets);

        // Handle ghost collisions
        this.handleGhostCollisions(ghosts, ghostsScared);
    }

    /**
    * Handle collisions with dots
    * @param {Dot[]} dots - Dots to check
    */
    private handleDotCollisions(dots: Dot[]): void {
        // Use a backward loop to safely remove items
        for (let i = dots.length - 1; i >= 0; i--) {
            const dot = dots[i];

            if (CollisionDetector.circlesIntersect(this.pacman, dot)) {
                // Handle the dot collection (sound effect)
                dot.onCollected(this.audioManager);

                // Notify through mediator that a dot was collected
                this.notifyDotCollected();

                // Remove the dot from the level
                this.levelAccessor.removeDot(dot);
            }
        }
    }

    /**
     * Notify that a dot was collected
     */
    private notifyDotCollected(): void {
        this.eventMediator.notify({
            type: GameEventType.DotCollected,
            data: {}  // No points data needed here
        });
    }

    /**
     * Handle collisions with walls
     * @param {Wall[]} walls - Walls to check
     */
    private handleWallCollisions(walls: Wall[]): void {
        for (const wall of walls) {
            wall.handleCollision(this.pacman);
        }
    }

    /**
     * Handle collisions with pellets
     * @param {(PowerPellet|PathPellet)[]} pellets - Pellets to check
     */
    private handlePelletCollisions(pellets: (PowerPellet | PathPellet)[]): void {
        // Use a backward loop to safely remove items
        for (let i = pellets.length - 1; i >= 0; i--) {
            const pellet = pellets[i];

            if (CollisionDetector.circlesIntersect(this.pacman, pellet)) {
                if (pellet instanceof PowerPellet) {
                    this.handlePowerPelletCollision(pellet);
                } else if (pellet instanceof PathPellet) {
                    this.handlePathPelletCollision(pellet);
                }

                // Remove the pellet from the level
                this.levelAccessor.removePellet(pellet);
            }
        }
    }

    /**
     * Handle power pellet collection
     * @param {PowerPellet} pellet - The power pellet that was collected
     */
    private handlePowerPelletCollision(pellet: PowerPellet): void {
        // Play sound effect
        pellet.onCollected(this.audioManager);

        // Notify through mediator
        this.eventMediator.notify({
            type: GameEventType.PelletCollected,
            data: {
                isPowerPellet: true,
                duration: 10000 // 10 seconds
            }
        });
    }

    /**
     * Handle path pellet collection
     * @param {PathPellet} pellet - The path pellet that was collected
     */
    private handlePathPelletCollision(pellet: PathPellet): void {
        // Trigger effect
        pellet.onCollected();

        // Notify through mediator
        this.eventMediator.notify({
            type: GameEventType.PelletCollected,
            data: {
                isPathPellet: true,
                duration: 15000 // 15 seconds
            }
        });
    }

    /**
     * Handle collisions with ghosts
     * @param {Ghost[]} ghosts - Ghosts to check
     * @param {boolean} ghostsScared - Whether ghosts are scared
     */
    private handleGhostCollisions(ghosts: Ghost[], ghostsScared: boolean): void {
        // Use a backward loop to safely remove items
        for (let i = ghosts.length - 1; i >= 0; i--) {
            const ghost = ghosts[i];

            const pacmanRect = this.pacman.asRect();
            const ghostRect = {
                x: ghost.x - ghost.getWidth() / 2,
                y: ghost.y - ghost.getHeight() / 2,
                width: ghost.getWidth(),
                height: ghost.getHeight()
            };

            if (CollisionDetector.rectanglesIntersect(pacmanRect, ghostRect)) {
                // Notify through mediator
                this.notifyGhostCollision(ghost, ghostsScared);

                if (ghostsScared) {
                    this.handleGhostDeath(ghost);
                } else {
                    this.handlePacmanDeath();
                }
            }
        }
    }

    /**
     * Notify about ghost collision
     * @param {Ghost} ghost - The ghost that was collided with
     * @param {boolean} ghostsScared - Whether ghosts are scared
     */
    private notifyGhostCollision(ghost: Ghost, ghostsScared: boolean): void {
        this.eventMediator.notify({
            type: GameEventType.GhostCollided,
            data: {
                ghostScared: ghostsScared,
                ghost: ghost
            }
        });
    }

    /**
     * Handle ghost death when Pacman eats a scared ghost
     * @param {Ghost} ghost - Ghost that was eaten
     */
    private handleGhostDeath(ghost: Ghost): void {
        // Ghost dies - create a new ghost at the random point
        const newGhost = ghost.die(
            this.audioManager,
            () => this.levelAccessor.getRandomPoint(),
            (x: number, y: number) => this.levelAccessor.getPoint(x, y)
        );

        // Notify through mediator about ghost being eaten
        this.notifyGhostEaten(ghost);

        // Remove the ghost from the level
        this.levelAccessor.removeGhost(ghost);

        // Respawn ghost after 5 seconds
        this.scheduleGhostRespawn(newGhost, 5000);
    }

    /**
     * Schedule a ghost to respawn
     * @param {Ghost} ghost - Ghost to respawn
     * @param {number} delay - Delay in milliseconds
     */
    private scheduleGhostRespawn(ghost: Ghost, delay: number): void {
        setTimeout(() => {
            this.levelAccessor.addGhost(ghost);
        }, delay);
    }

    /**
     * Notify that a ghost was eaten
     * @param {Ghost} ghost - The ghost that was eaten
     */
    private notifyGhostEaten(ghost: Ghost): void {
        this.eventMediator.notify({
            type: GameEventType.GhostEaten,
            data: { ghost: ghost }
        });
    }

    /**
     * Handle Pacman death when hit by a ghost
     */
    private handlePacmanDeath(): void {
        // Pacman dies
        const gameOver = this.pacman.die(this.audioManager);

        // Notify through mediator
        this.notifyPacmanDied(gameOver);

        if (!gameOver) {
            this.resetPacmanPosition();
        }
    }

    /**
     * Notify that Pacman died
     * @param {boolean} gameOver - Whether the game is over
     */
    private notifyPacmanDied(gameOver: boolean): void {
        this.eventMediator.notify({
            type: GameEventType.PacmanDied,
            data: { gameOver: gameOver }
        });
    }

    /**
     * Reset Pacman to starting position
     */
    private resetPacmanPosition(): void {
        // If not game over, reset pacman position
        const startNode = this.levelAccessor.getStartNode();
        if (startNode) {
            const tileSize = this.levelAccessor.getTileSize();
            const x = startNode.x * tileSize + tileSize / 2;
            const y = startNode.y * tileSize + tileSize / 2;
            
            this.pacman.reposition(x, y);
        }
    }
}