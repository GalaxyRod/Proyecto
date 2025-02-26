import Pacman from "../../entities/Pacman";
import { GameSubsystem } from "../../types";
import { LevelAccessor } from "../../types/LevelAccessor";
import AudioManager from "../../utils/Managers/AudioManager";
import CollisionSystem from "../Collisions/CollisionSystem";
import EventMediator from "../EventMediator";
import GameState from "../GameState";

/**
 * Entity system manages game entities (ghosts, dots, etc.)
 */
export class EntitySystem implements GameSubsystem {
  private readonly pacman: Pacman;
  private level: LevelAccessor | null;
  private collisionSystem: CollisionSystem | null;
  private readonly audioManager: AudioManager;
  private readonly eventMediator: EventMediator;
  private readonly gameState: GameState;
  private frameCount: number;
  
  constructor(
    pacman: Pacman,
    audioManager: AudioManager,
    eventMediator: EventMediator,
    gameState: GameState
  ) {
    this.pacman = pacman;
    this.level = null;
    this.collisionSystem = null;
    this.audioManager = audioManager;
    this.eventMediator = eventMediator;
    this.gameState = gameState;
    this.frameCount = 0;
  }
  
  setLevel(level: LevelAccessor): void {
    this.level = level;
    this.collisionSystem = new CollisionSystem(
      level,
      this.pacman,
      this.audioManager,
      this.eventMediator
    );
  }
  
  update(): void {
    if (!this.gameState.isPlaying()) {
      return;
    }
    
    this.frameCount++;
    
    // Update Pacman
    this.pacman.update();
    
    // Get ghost scared state once
    const ghostsScared = this.gameState.areGhostsScared();
    
    // Update other entities
    this.updateLevelEntities(ghostsScared);
    
    // Check collisions
    this.handleCollisions(ghostsScared);
    
    // Check win condition
    this.checkWinCondition();
  }
  
  private updateLevelEntities(ghostsScared: boolean): void {
    if (!this.level) return;

    // Update ghosts
    const ghosts = this.level.getGhosts();

    ghosts.forEach(ghost => {
      ghost.update(
        this.frameCount,
        ghostsScared,
        () => this.getPacmanPoint(),
        (x: number, y: number) => {
          if (!this.level) throw new Error("Level not initialized");
          return this.level.getPoint(x, y);
        },
        () => {
          if (!this.level) throw new Error("Level not initialized");
          return this.level.getRandomPoint();
        }
      );
    });
  }
  
  private handleCollisions(ghostsScared: boolean): void {
    if (!this.collisionSystem) return;

    // Check collisions using our new parameter
    this.collisionSystem.update(ghostsScared);
  }
  
  private checkWinCondition(): void {
    if (!this.level) return;

    // Check if all dots are collected
    if (this.level.isCompleted() && this.gameState.getScore() > 0) {
      this.gameState.winGame();
    }
  }
  
  private getPacmanPoint(): any {
    if (!this.level) {
      throw new Error("Level not initialized");
    }
    return this.level.getPoint(this.pacman.x, this.pacman.y);
  }
  
  getLevel(): LevelAccessor | null {
    return this.level;
  }
  
  reset(): void {
    this.frameCount = 0;
  }
}