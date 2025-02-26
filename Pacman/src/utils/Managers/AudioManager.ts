import { SoundEffect } from "../../types";
import { GameError } from "../Errors/GameError";
import { GameErrorType } from "../../enums";

/**
 * Audio resource management and playback
 */
export default class AudioManager {
  private readonly sounds: Map<string, HTMLAudioElement>;
  private readonly soundPaths: Map<string, string>;
  private masterVolume: number;
  private isMuted: boolean;
  private soundEnabled: boolean;
  private resourcesLoaded: boolean;

  /**
   * @param {boolean} soundEnabled - Whether sound is initially enabled
   * @param {number} initialVolume - Initial volume level (0.0-1.0)
   */
  constructor(soundEnabled: boolean = true, initialVolume: number = 0.7) {
    this.sounds = new Map<string, HTMLAudioElement>();
    this.soundPaths = new Map<string, string>([
      ['chomp', 'res/sounds/chomp.wav'],
      ['beginning', 'res/sounds/beginning.wav'],
      ['death', 'res/sounds/pacman_death.wav'],
      ['eatGhost', 'res/sounds/pacman_eatghost.wav'],
      ['eatFruit', 'res/sounds/pacman_eatfruit.wav'],
      ['intermission', 'res/sounds/pacman_intermission.wav']
    ]);
    
    this.masterVolume = Math.max(0, Math.min(1, initialVolume)); // Clamp between 0-1
    this.isMuted = false;
    this.soundEnabled = soundEnabled;
    this.resourcesLoaded = false;
  }
  
  /**
   * Load sound assets
   * @returns {Promise<void>} Promise that resolves when all sounds are loaded
   */
  async loadSounds(): Promise<void> {
    try {
      const loadPromises: Promise<void>[] = [];
      
      // Create and load each sound
      this.soundPaths.forEach((path, key) => {
        const sound = new Audio(path);
        this.sounds.set(key, sound);
        
        // Create a promise for this sound loading
        const loadPromise = new Promise<void>((resolve) => {
          sound.addEventListener('canplaythrough', () => resolve(), { once: true });
          // If the audio is already loaded, resolve immediately
          if (sound.readyState === 4) resolve();
        });
        
        loadPromises.push(loadPromise);
      });
      
      // Wait for all sounds to load
      await Promise.all(loadPromises);
      
      // Update volumes once loaded
      this.updateAllSoundVolumes();
      this.resourcesLoaded = true;
    } catch (error) {
      this.resourcesLoaded = false;
      throw new GameError(
        GameErrorType.AudioLoadError,
        `Failed to load audio resources: ${(error as Error).message}`,
        error as Error
      );
    }
  }

  /**
   * Play a sound
   * @param {SoundEffect} soundName - Name of the sound to play
   * @param {number} volumeScale - Optional volume scaling factor (0.0-1.0)
   */
  play(soundName: SoundEffect, volumeScale: number = 1.0): void {
    if (!this.resourcesLoaded || !this.soundEnabled || this.isMuted) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Clone the audio to allow multiple plays simultaneously
      const clonedSound = sound.cloneNode(true) as HTMLAudioElement;
      clonedSound.volume = this.masterVolume * volumeScale;
      clonedSound.play().catch((e: Error) => console.error(`Error playing ${soundName}:`, e));
    }
  }
  
  /**
   * Set master volume
   * @param {number} volume - Volume level (0.0-1.0)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0-1
    this.updateAllSoundVolumes();
  }
  
  /**
   * Get current volume
   * @returns {number} Current volume level
   */
  getVolume(): number {
    return this.masterVolume;
  }
  
  /**
   * Mute or unmute all sounds
   * @param {boolean} mute - Whether to mute sounds
   */
  setMuted(mute: boolean): void {
    this.isMuted = mute;
  }
  
  /**
   * Toggle mute state
   * @returns {boolean} New mute state
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
  
  /**
   * Enable or disable sound
   * @param {boolean} enabled - Whether sound is enabled
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }
  
  /**
   * Check if sound is enabled
   * @returns {boolean} Whether sound is enabled
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
  
  /**
   * Update volume for all sound effects
   */
  private updateAllSoundVolumes(): void {
    this.sounds.forEach(sound => {
      sound.volume = this.masterVolume;
    });
  }
  
  /**
   * Add a new sound
   * @param {string} name - Sound name
   * @param {string} path - Sound file path
   */
  addSound(name: string, path: string): void {
    this.soundPaths.set(name, path);
    
    // If resources already loaded, load this new sound too
    if (this.resourcesLoaded) {
      const sound = new Audio(path);
      sound.volume = this.masterVolume;
      this.sounds.set(name, sound);
    }
  }
  
  /**
   * Dispose and clean up resources
   */
  dispose(): void {
    this.sounds.clear();
  }
}