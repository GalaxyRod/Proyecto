import Pacman from "../../entities/Pacman";
import { GameSubsystem } from "../../types";
import InputManager from "../../utils/Managers/InputManager";
import GameState from "../GameState";

/**
 * Input system handles all input-related functionality
 */
export class InputSystem implements GameSubsystem {
  private readonly inputManager: InputManager;
  private readonly pacman: Pacman;
  private readonly gameState: GameState;
  private readonly onRestart: () => void;
  
  constructor(
    inputManager: InputManager, 
    pacman: Pacman,
    gameState: GameState,
    onRestart: () => void
  ) {
    this.inputManager = inputManager;
    this.pacman = pacman;
    this.gameState = gameState;
    this.onRestart = onRestart;
    
    this.setupInputHandlers();
  }
  
  private setupInputHandlers(): void {
    // Pacman movement using the new action-based approach
    this.inputManager.registerMovementHandlers(this.pacman);

    // Game control handlers
    this.inputManager.registerPauseHandler(() => {
      this.gameState.togglePause();
    });

    this.inputManager.registerGeneralActionHandler(() => {
      if (this.gameState.isGameOver() || this.gameState.isVictory()) {
        this.onRestart();
      }
    });
  }
  
  update(): void {
    // No per-frame update needed
  }
}