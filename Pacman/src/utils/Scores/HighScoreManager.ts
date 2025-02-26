import { GameError } from "../../utils/Errors/GameError";
import { GameErrorType } from "../../enums";
import { HighScoreEntry } from "../../types";

/**
 * Manages high scores for the game
 */
/**
 * High score manager singleton
 */
export default class HighScoreManager {
  private static instance: HighScoreManager;
  private readonly maxScores: number;
  private readonly storageKey: string;
  private scores: HighScoreEntry[];

  /**
   * @param {number} maxScores - Maximum number of high scores to keep
   * @param {string} storageKey - Local storage key for scores
   */
  /**
   * Get the singleton instance
   * @param {number} maxScores - Maximum number of high scores to keep
   * @param {string} storageKey - Local storage key for scores
   * @returns {HighScoreManager} The singleton instance
   */
  public static getInstance(maxScores: number = 10, storageKey: string = 'pacman-high-scores'): HighScoreManager {
    if (!HighScoreManager.instance) {
      HighScoreManager.instance = new HighScoreManager(maxScores, storageKey);
    }
    return HighScoreManager.instance;
  }

  /**
   * Private constructor to enforce singleton pattern
   * @param {number} maxScores - Maximum number of high scores to keep
   * @param {string} storageKey - Local storage key for scores
   */
  private constructor(maxScores: number = 10, storageKey: string = 'pacman-high-scores') {
    this.maxScores = maxScores;
    this.storageKey = storageKey;
    this.scores = this.loadScores();
  }

  /**
   * Add a new score to the high scores
   * @param {string} name - Player name (max 4 characters)
   * @param {number} score - Player score
   * @param {number} level - Level reached
   * @returns {boolean} True if score was high enough to be added
   */
  addScore(name: string, score: number, level: number): boolean {
    // Ensure name is uppercase and max 4 characters
    const formattedName = name.toUpperCase().substring(0, 4);
    
    // Create new entry with current date
    const newEntry: HighScoreEntry = {
      name: formattedName,
      score,
      level,
      date: new Date().toISOString()
    };
    
    // Add to scores array
    this.scores.push(newEntry);
    
    // Sort by score (highest first)
    this.scores.sort((a, b) => b.score - a.score);
    
    // Trim to maximum number of scores
    if (this.scores.length > this.maxScores) {
      this.scores = this.scores.slice(0, this.maxScores);
    }
    
    // Save to local storage
    this.saveScores();
    
    // Return true if the score was added to the list
    return this.scores.includes(newEntry);
  }

  /**
   * Check if a score would qualify for the high score list
   * @param {number} score - Score to check
   * @returns {boolean} True if score would qualify
   */
  isHighScore(score: number): boolean {
    // If we don't have max scores yet, any score qualifies
    if (this.scores.length < this.maxScores) {
      return true;
    }
    
    // Otherwise, check if it's higher than the lowest score
    const lowestScore = this.scores[this.scores.length - 1].score;
    return score > lowestScore;
  }

  /**
   * Get all high scores
   * @returns {HighScoreEntry[]} Array of high scores
   */
  getScores(): HighScoreEntry[] {
    return [...this.scores];
  }

  /**
   * Clear all high scores
   */
  clearScores(): void {
    this.scores = [];
    this.saveScores();
  }

  /**
   * Load scores from local storage
   * @returns {HighScoreEntry[]} Loaded scores or empty array
   */
  private loadScores(): HighScoreEntry[] {
    try {
      const scoresJson = localStorage.getItem(this.storageKey);
      if (scoresJson) {
        return JSON.parse(scoresJson);
      }
    } catch (error) {
      console.error('Error loading high scores:', error);
      throw new GameError(
        GameErrorType.DataStorageError,
        `Failed to load high scores: ${(error as Error).message}`,
        error as Error
      );
    }
    return [];
  }

  /**
   * Save scores to local storage
   */
  private saveScores(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    } catch (error) {
      console.error('Error saving high scores:', error);
      throw new GameError(
        GameErrorType.DataStorageError,
        `Failed to save high scores: ${(error as Error).message}`,
        error as Error
      );
    }
  }
}