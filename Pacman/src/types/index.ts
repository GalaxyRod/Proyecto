import Entity from "../entities/Entity";
import Ghost from "../entities/Ghost/Ghost";
import { GameEventType } from "../enums";

// Speed interface
export interface Speed {
  dx: number;
  dy: number;
  magnitude: number;
}

// Direction interface
export interface Direction {
  name: string;
  angle: number;
}

// Mouth animation interface
export interface MouthAnimation {
  speed: number;
  gap: number;
  angle: number;
  direction: number;
  update: () => void;
}

// Rectangle interface for collision detection
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Point interface
export interface Point {
  x: number;
  y: number;
}

// Define sound effect types for type safety
export type SoundEffect = 'chomp' | 'beginning' | 'death' | 'eatGhost' | 'eatFruit' | 'intermission';

/**
* Manages user input
*/

// Define input configuration type
export interface InputConfig {
  up: string;
  down: string;
  left: string;
  right: string;
  pause?: string;
  action?: string;
}

// Define default key configurations
export const DEFAULT_CONFIG: InputConfig = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  pause: 'Escape',
  action: ' ' // Space
};

export const WASD_CONFIG: InputConfig = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
  pause: 'Escape',
  action: ' ' // Space
};

/**
 * Information about a collision between entities
 */
export interface CollisionInfo {
  collided: boolean;
  dx: number;
  dy: number;
  crossWidth: number;
  crossHeight: number;
}

/**
 * Event data interface for type safety
 */
export interface GameEvent<T = any> {
  type: GameEventType;
  data?: T;
}


/**
 * Type-safe event listener
 */
export type GameEventListener<T = any> = (event: GameEvent<T>) => void;

/**
 * Type definitions for different event types
 */
export interface EventDataMap {
  [GameEventType.DotCollected]: { points: number };
  [GameEventType.PelletCollected]: {
    isPowerPellet?: boolean;
    isPathPellet?: boolean;
    duration?: number;
  };
  [GameEventType.PacmanDied]: { gameOver: boolean };
  [GameEventType.GameResumed]: {
    controlsChanged?: boolean;
    soundChanged?: boolean;
    soundEnabled?: boolean;
    powerModeEnded?: boolean;
  };
  [GameEventType.GameOver]: { score: number };
  [GameEventType.LevelCompleted]: {
    score: number;
    level: number;
  };
  [GameEventType.LevelLoaded]: {
    level: number;
    path: string;
  };
  [GameEventType.GhostCollided]: {
    ghostScared: boolean;
    ghost: any;
  };
  [GameEventType.GhostEaten]: {
    ghost: Ghost;
  };

  [GameEventType.FruitCollected]: {
    fruitType?: string;
    points?: number;
  };

  [GameEventType.ScoreChanged]: {
    score: number;
    pointsAdded: number;
  };
  [GameEventType.PowerModeEnded]: {
    // No data needed for this event
  };

  // New high score events
  [GameEventType.HighScoreAdded]: {
    name: string;
    score: number;
  };
  [GameEventType.ShowNameInput]: {
    score: number;
  };
  [GameEventType.ShowHighScores]: {
    // No data needed for this event
  };
}

/**
 * Get event data type for a specific event type
 */
export type EventData<T extends GameEventType> = T extends keyof EventDataMap
  ? EventDataMap[T]
  : any;

/**
 * Core game system interfaces for better composition
 */
export interface GameSubsystem {
  update(): void;
  reset?(): void;
  dispose?(): void;
}

/**
 * Position component interface
 */
export interface PositionComponent {
  x: number;
  y: number;
  reposition(x: number, y: number): void;
}

/**
 * Physics component interface
 */
export interface PhysicsComponent {
  update(): void;
  setSpeed(dx: number, dy: number): void;
  setMagnitude(magnitude: number): void;
  stop(): void;
}

/**
 * Rendering component interface
 */
export interface RenderComponent {
  draw(ctx: CanvasRenderingContext2D, ...args: any[]): void;
}

/**
 * Collision component interface
 */
export interface CollisionComponent {
  checkCollision(other: Entity): boolean;
  getCollisionShape(): any; // Shape for collision detection
}

/**
 * Interface for a high score entry
 */
export interface HighScoreEntry {
  name: string;
  score: number;
  level: number;
  date: string;
}