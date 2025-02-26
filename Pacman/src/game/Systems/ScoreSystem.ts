import { GameEventType } from "../../enums";
import { GameSubsystem } from "../../types";
import EventMediator from "../EventMediator";

/**
 * Manages scoring for the game
 */
export class ScoreSystem implements GameSubsystem {
    private score: number;
    private readonly eventMediator: EventMediator;

    // Score values for different game events
    private readonly scoreValues: {
        dot: number;
        powerPellet: number;
        pathPellet: number;
        ghost: number[];  // Array of ghost values for consecutive ghosts
        fruit: number;
        levelCompletion: number;
    };

    // Consecutive ghosts eaten in power mode
    private consecutiveGhosts: number;

    /**
     * @param {EventMediator} eventMediator - Event mediator for notifications
     */
    constructor(eventMediator: EventMediator) {
        this.score = 0;
        this.eventMediator = eventMediator;
        this.consecutiveGhosts = 0;

        // Default score values
        this.scoreValues = {
            dot: 0.5,
            powerPellet: 1,
            pathPellet: 1,
            ghost: [1, 2, 4, 8],  // Original Pac-Man values
            fruit: 5,            // Not added
            levelCompletion: 1
        };

        // Register event listeners
        this.setupEventListeners();
    }

    /**
   * Set up event listeners
   */
    private setupEventListeners(): void {
        // Listen for relevant game events
        this.eventMediator.register(GameEventType.DotCollected, () => {
            this.addScore(this.scoreValues.dot);
        });

        this.eventMediator.register(GameEventType.PelletCollected, (event) => {
            if (event.data?.isPowerPellet) {
                this.addScore(this.scoreValues.powerPellet);
                this.resetConsecutiveGhosts();
            } else if (event.data?.isPathPellet) {
                this.addScore(this.scoreValues.pathPellet);
            }
        });

        this.eventMediator.register(GameEventType.GhostEaten, () => {
            this.addGhostScore();
        });

        this.eventMediator.register(GameEventType.FruitCollected, () => {
            this.addScore(this.scoreValues.fruit);
        });

        this.eventMediator.register(GameEventType.LevelCompleted, () => {
            this.addScore(this.scoreValues.levelCompletion);
        });

        // Need to update the EventDataMap to include this property
        this.eventMediator.register(GameEventType.PowerModeEnded, () => {
            this.resetConsecutiveGhosts();
        });
    }

    /**
     * Add points to the score
     * @param {number} points - Points to add
     */
    addScore(points: number): void {
        this.score += points;

        // Notify about score change
        this.eventMediator.notify({
            type: GameEventType.ScoreChanged,
            data: { score: this.score, pointsAdded: points }
        });
    }

    /**
     * Add score for eating a ghost
     */
    addGhostScore(): void {
        // Get the appropriate score based on consecutive ghosts eaten
        const index = Math.min(this.consecutiveGhosts, this.scoreValues.ghost.length - 1);
        const points = this.scoreValues.ghost[index];

        // Increment consecutive ghosts counter
        this.consecutiveGhosts++;

        // Add the score
        this.addScore(points);
    }

    /**
     * Reset consecutive ghosts counter
     */
    resetConsecutiveGhosts(): void {
        this.consecutiveGhosts = 0;
    }

    /**
     * Get current score
     * @returns {number} Current score
     */
    getScore(): number {
        return this.score;
    }

    /**
     * Set score (for loading saved games, etc.)
     * @param {number} score - New score
     */
    setScore(score: number): void {
        this.score = score;

        this.eventMediator.notify({
            type: GameEventType.ScoreChanged,
            data: { score: this.score, pointsAdded: 0 }
        });
    }

    /**
     * Configure score values
     * @param {Object} newValues - New score values
     */
    configureScores(newValues: Partial<typeof this.scoreValues>): void {
        Object.assign(this.scoreValues, newValues);
    }

    /**
     * Reset score to zero
     */
    reset(): void {
        this.score = 0;
        this.consecutiveGhosts = 0;
    }

    /**
     * Update method (no per-frame updates needed)
     */
    update(): void {
        // No per-frame updates needed
    }
}