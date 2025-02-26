import { GameEventType, GameStatus } from "../enums";
import { GameSubsystem } from "../types";
import { TimerManager } from "../utils/Managers/TimerManager";
import EventMediator from "./EventMediator";
import { ScoreSystem } from "./Systems/ScoreSystem";

/**
 * Manages game state
 */
export default class GameState implements GameSubsystem {
  private status: GameStatus;
  private level: number;
  private ghostsScared: boolean;
  private showPath: boolean;
  private readonly timerManager: TimerManager;
  private readonly scoreSystem: ScoreSystem;
  private statusChangeCallback: ((status: GameStatus) => void) | null;
  
  // Timer IDs
  private static readonly SCARED_TIMER = 'ghostsScared';
  private static readonly PATH_TIMER = 'showPath';
  
  /**
   * @param {ScoreSystem} scoreSystem - Score system
   * @param {Function|null} statusChangeCallback - Callback to run when status changes
   */
  constructor(
    scoreSystem: ScoreSystem,
    statusChangeCallback: ((status: GameStatus) => void) | null = null
  ) {
    this.status = GameStatus.Loading;
    this.level = 1;
    this.ghostsScared = false;
    this.showPath = false;
    this.timerManager = new TimerManager();
    this.scoreSystem = scoreSystem;
    this.statusChangeCallback = statusChangeCallback;
  }
  
  /**
   * Reset game state
   */
  reset(): void {
    this.status = GameStatus.Loading;
    this.level = 1;
    this.ghostsScared = false;
    this.showPath = false;
    this.timerManager.clearAllTimers();
    this.scoreSystem.reset();
  }
  
  /**
   * Start the game
   */
  startGame(): void {
    this.setStatus(GameStatus.Playing);
  }
  
  /**
   * Pause the game
   */
  pauseGame(): void {
    if (this.status === GameStatus.Playing) {
      this.setStatus(GameStatus.Paused);
    }
  }
  
  /**
   * Resume the game
   */
  resumeGame(): void {
    if (this.status === GameStatus.Paused) {
      this.setStatus(GameStatus.Playing);
    }
  }
  
  /**
   * Toggle pause state
   * @returns {boolean} True if game is now paused
   */
  togglePause(): boolean {
    if (this.status === GameStatus.Playing) {
      this.pauseGame();
      return true;
    } else if (this.status === GameStatus.Paused) {
      this.resumeGame();
      return false;
    }
    return false; // Return false for any other state
  }
  
  /**
   * End the game (player lost)
   */
  endGame(): void {
    this.setStatus(GameStatus.GameOver);
    this.timerManager.clearAllTimers();
  }
  
  /**
   * Player won the level
   */
  winGame(): void {
    this.setStatus(GameStatus.Victory);
    this.timerManager.clearAllTimers();
  }
  
  /**
   * Show name input screen
   */
  showNameInput(): void {
    this.setStatus(GameStatus.NameInput);
  }
  
  /**
   * Show high scores screen
   */
  showHighScores(): void {
    this.setStatus(GameStatus.HighScores);
  }
  
  /**
   * Advance to the next level
   */
  nextLevel(): void {
    this.level++;
    this.timerManager.clearAllTimers();
  }
  
  /**
   * Get current score (delegated to ScoreSystem)
   * @returns {number} Current score
   */
  getScore(): number {
    return this.scoreSystem.getScore();
  }
  
  /**
   * Add score (delegated to ScoreSystem)
   * @param {number} points - Points to add
   */
  addScore(points: number): void {
    this.scoreSystem.addScore(points);
  }
  
  /**
   * Set ghosts to scared state
   * @param {number} duration - Duration in milliseconds
   */
  setGhostsScared(duration: number): void {
    this.ghostsScared = true;
    
    // Reset consecutive ghosts when power mode starts
    this.scoreSystem.resetConsecutiveGhosts();
    
    this.timerManager.setTimer(GameState.SCARED_TIMER, () => {
      this.ghostsScared = false;
      
      // Notify that power mode ended
      EventMediator.getInstance().notify({
        type: GameEventType.PowerModeEnded,
        data: { powerModeEnded: true }
      });
    }, duration);
  }
  
  /**
   * Show ghost paths
   * @param {number} duration - Duration in milliseconds
   */
  setShowPath(duration: number): void {
    this.showPath = true;
    
    this.timerManager.setTimer(GameState.PATH_TIMER, () => {
      this.showPath = false;
    }, duration);
  }
  
  /**
   * Set game status
   * @param {GameStatus} status - New status
   */
  private setStatus(status: GameStatus): void {
    const oldStatus = this.status;
    this.status = status;
    
    if (oldStatus !== status && this.statusChangeCallback) {
      this.statusChangeCallback(status);
    }
  }
  
  /**
   * Get current level
   * @returns {number} Current level
   */
  getLevel(): number {
    return this.level;
  }
  
  /**
   * Get game status
   * @returns {GameStatus} Current game status
   */
  getStatus(): GameStatus {
    return this.status;
  }
  
  /**
   * Check if game is paused
   * @returns {boolean} True if game is paused
   */
  isPaused(): boolean {
    return this.status === GameStatus.Paused;
  }
  
  /**
   * Check if game is over
   * @returns {boolean} True if game is over
   */
  isGameOver(): boolean {
    return this.status === GameStatus.GameOver;
  }
  
  /**
   * Check if player won
   * @returns {boolean} True if player won
   */
  isVictory(): boolean {
    return this.status === GameStatus.Victory;
  }
  
  /**
   * Check if game is in progress
   * @returns {boolean} True if game is in progress
   */
  isPlaying(): boolean {
    return this.status === GameStatus.Playing;
  }
  
  /**
   * Check if name input is shown
   * @returns {boolean} True if name input is shown
   */
  isNameInput(): boolean {
    return this.status === GameStatus.NameInput;
  }
  
  /**
   * Check if high scores are shown
   * @returns {boolean} True if high scores are shown
   */
  isHighScores(): boolean {
    return this.status === GameStatus.HighScores;
  }
  
  /**
   * Check if ghosts are scared
   * @returns {boolean} True if ghosts are scared
   */
  areGhostsScared(): boolean {
    return this.ghostsScared;
  }
  
  /**
   * Check if paths should be shown
   * @returns {boolean} True if paths should be shown
   */
  shouldShowPath(): boolean {
    return this.showPath;
  }
  
  /**
   * Set status change callback
   * @param {Function|null} callback - Callback function
   */
  setStatusChangeCallback(callback: ((status: GameStatus) => void) | null): void {
    this.statusChangeCallback = callback;
  }
  
  /**
   * Update method (implementation of GameSubsystem interface)
   */
  update(): void {
    // No per-frame updates needed
  }
  
  /**
   * Clean up resources
   */
  dispose(): void {
    this.timerManager.clearAllTimers();
  }
}