import AudioManager from "../../utils/Managers/AudioManager";

/**
 * Life component for Pacman
 */
export class LifeComponent {
  private lives: number;
  private invincible: boolean;
  private invincibilityTimer: number | null;
  private blinkInterval: number | null;
  private readonly onVisibilityChange: (visible: boolean) => void;
  private readonly onInvincibilityChange: (invincible: boolean) => void;

  /**
   * @param {number} initialLives - Initial lives count
   * @param {Function} onVisibilityChange - Callback for visibility changes
   * @param {Function} onInvincibilityChange - Callback for invincibility changes
   */
  constructor(
    onVisibilityChange: (visible: boolean) => void,
    onInvincibilityChange: (invincible: boolean) => void,
    initialLives: number = 2
  ) {
    this.lives = initialLives;
    this.invincible = false;
    this.invincibilityTimer = null;
    this.blinkInterval = null;
    this.onVisibilityChange = onVisibilityChange;
    this.onInvincibilityChange = onInvincibilityChange;
  }

  /**
   * Get remaining lives
   * @returns {number} Current lives
   */
  getLives(): number {
    return this.lives;
  }

  /**
   * Add a life
   */
  addLife(): void {
    this.lives++;
  }

  /**
   * Handle death
   * @param {AudioManager} audioManager - Audio manager
   * @returns {boolean} True if game over
   */
  die(audioManager: AudioManager): boolean {
    // If invincible, don't die
    if (this.invincible) return false;

    this.lives--;

    if (this.lives < 0) {
      // Play a death sound on game over
      audioManager.play('death');
      return true; // Game over
    }

    // Make invincible briefly after death
    this.setInvincible(3000);

    return false; // Game continues
  }

  /**
   * Make Pacman temporarily invincible
   * @param {number} duration - Duration in milliseconds
   */
  setInvincible(duration: number): void {
    this.invincible = true;
    this.onInvincibilityChange(true);

    // Clear any existing timers
    this.clearTimers();

    // Set up blinking effect
    this.blinkInterval = window.setInterval(() => {
      this.onVisibilityChange(!this.onVisibilityChange);
    }, 200);

    // Set timer to remove invincibility
    this.invincibilityTimer = window.setTimeout(() => {
      this.invincible = false;
      this.onInvincibilityChange(false);
      this.onVisibilityChange(true);
      this.clearTimers();
    }, duration);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.invincibilityTimer !== null) {
      clearTimeout(this.invincibilityTimer);
      this.invincibilityTimer = null;
    }

    if (this.blinkInterval !== null) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }
  }

  /**
   * Check if invincible
   * @returns {boolean} True if invincible
   */
  isInvincible(): boolean {
    return this.invincible;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.clearTimers();
  }
}