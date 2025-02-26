import AudioManager from '../utils/Managers/AudioManager';
import Entity from './Entity';
import { CircularEntity } from '../utils/Utils';

/**
 * Dot entity that Pacman eats to get points
 */
export default class Dot extends Entity implements CircularEntity {
  private readonly radius: number;

  /**
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Radius
   */
  constructor(x: number, y: number, radius: number) {
    super(x, y);
    this.radius = radius;
  }

  /**
   * Draw the dot
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  /**
   * Handle dot collection
   * @param {AudioManager} audioManager - Audio manager
   */
  onCollected(audioManager: AudioManager): void {
    audioManager.play('chomp');
    // No longer returning points - this is handled by ScoreSystem
  }
  
  /**
   * Get dot radius
   * @returns {number} Radius
   */
  getRadius(): number {
    return this.radius;
  }

  /**
   * Update method (empty as dots don't need updates)
   * Implements abstract method from Entity
   */
  override update(): void {
    // Dots are static and don't need updating
  }
}