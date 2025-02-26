import { GameEventType, GameStatus } from "../../enums";
import { GameEvent, GameSubsystem } from "../../types";
import AudioManager from "../../utils/Managers/AudioManager";
import EventMediator from "../EventMediator";
import GameState from "../GameState";

/**
 * Event system handles event registration and notifications
 */
export class EventSystem implements GameSubsystem {
  private readonly eventMediator: EventMediator;
  private readonly gameState: GameState;
  private readonly audioManager: AudioManager;
  
  constructor(
    eventMediator: EventMediator,
    gameState: GameState,
    audioManager: AudioManager
  ) {
    this.eventMediator = eventMediator;
    this.gameState = gameState;
    this.audioManager = audioManager;
    
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    // Listen for score changes
    this.eventMediator.register(GameEventType.DotCollected, (event: GameEvent) => {
      if (event.data && typeof event.data.points === 'number') {
        this.gameState.addScore(event.data.points);
      }
    });

    // Listen for pellet collection
    this.eventMediator.register(GameEventType.PelletCollected, (event: GameEvent) => {
      if (event.data) {
        if (event.data.isPowerPellet) {
          this.gameState.setGhostsScared(event.data.duration || 10000);
        } else if (event.data.isPathPellet) {
          this.gameState.setShowPath(event.data.duration || 15000);
        }
      }
    });

    // Listen for game over
    this.eventMediator.register(GameEventType.PacmanDied, (event: GameEvent) => {
      if (event.data?.gameOver) {
        this.gameState.endGame();
      }
    });
    
    // Listen for high score events
    this.eventMediator.register(GameEventType.ShowNameInput, () => {
      this.gameState.showNameInput();
    });
    
    this.eventMediator.register(GameEventType.ShowHighScores, () => {
      this.gameState.showHighScores();
    });
    
    this.eventMediator.register(GameEventType.HighScoreAdded, () => {
      // Play a sound when a high score is added
      this.audioManager.play('eatFruit');
    });
    
    // Set up game state change handler
    this.gameState.setStatusChangeCallback(this.handleGameStatusChange.bind(this));
  }
  
  private handleGameStatusChange(status: GameStatus): void {
    switch (status) {
      case GameStatus.Playing:
        // Notify through mediator
        this.eventMediator.notify({
          type: GameEventType.GameResumed
        });
        break;

      case GameStatus.Paused:
        // Notify through mediator
        this.eventMediator.notify({
          type: GameEventType.GamePaused
        });
        break;

      case GameStatus.GameOver:
        this.audioManager.play('death');

        // Notify through mediator
        this.eventMediator.notify({
          type: GameEventType.GameOver,
          data: { score: this.gameState.getScore() }
        });
        break;

      case GameStatus.Victory:
        this.audioManager.play('intermission');

        // Notify through mediator
        this.eventMediator.notify({
          type: GameEventType.LevelCompleted,
          data: {
            score: this.gameState.getScore(),
            level: this.gameState.getLevel()
          }
        });
        break;
        
      case GameStatus.NameInput:
        // Notify through mediator
        this.eventMediator.notify({
          type: GameEventType.ShowNameInput,
          data: { score: this.gameState.getScore() }
        });
        break;
        
      case GameStatus.HighScores:
        // Notify through mediator
        this.eventMediator.notify({
          type: GameEventType.ShowHighScores
        });
        break;
    }
  }
  
  update(): void {
    // No per-frame update needed
  }
}