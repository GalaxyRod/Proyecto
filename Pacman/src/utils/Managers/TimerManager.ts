/**
 * Manages game timers
 */
export class TimerManager {
    private readonly timers: Map<string, number>;
    
    constructor() {
      this.timers = new Map<string, number>();
    }
    
    /**
     * Set a timer
     * @param {string} id - Timer identifier
     * @param {Function} callback - Function to call when timer completes
     * @param {number} duration - Duration in milliseconds
     */
    setTimer(id: string, callback: () => void, duration: number): void {
      // Clear existing timer if it exists
      this.clearTimer(id);
      
      // Set new timer
      const timerId = window.setTimeout(() => {
        callback();
        this.timers.delete(id);
      }, duration);
      
      this.timers.set(id, timerId);
    }
    
    /**
     * Clear a specific timer
     * @param {string} id - Timer identifier
     */
    clearTimer(id: string): void {
      const timerId = this.timers.get(id);
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
        this.timers.delete(id);
      }
    }
    
    /**
     * Clear all timers
     */
    clearAllTimers(): void {
      this.timers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      this.timers.clear();
    }
    
    /**
     * Check if a timer is active
     * @param {string} id - Timer identifier
     * @returns {boolean} - Whether timer is active
     */
    isTimerActive(id: string): boolean {
      return this.timers.has(id);
    }
  }