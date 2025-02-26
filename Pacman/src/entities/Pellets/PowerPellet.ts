import AudioManager from '../../utils/Managers/AudioManager';
import Entity from '../Entity';
import { CircularEntity } from '../../utils/Utils';

/**
 * Power pellet that makes ghosts vulnerable
 */
export default class PowerPellet extends Entity implements CircularEntity {
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
   * Draw the power pellet
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  override draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  /**
   * Handle power pellet collection
   * @param {AudioManager} audioManager - Audio manager
   */
  onCollected(audioManager: AudioManager): void {
    audioManager.play('eatFruit');
  }
  
  /**
   * Get pellet radius
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
    // Pellets are static and don't need updating
  }
}