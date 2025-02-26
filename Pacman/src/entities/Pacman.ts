import { Rectangle } from "../types";
import AudioManager from "../utils/Managers/AudioManager";
import Entity from "./Entity";
import { CircleCollisionComponent } from "./PacmanComponents/CircleCollisionComponent";
import { LifeComponent } from "./PacmanComponents/LifeComponent";
import { MouthAnimationComponent } from "./PacmanComponents/MouthAnimationComponent";
import { MovementComponent } from "./MutualComponents/MovementComponent";
import { PacmanRenderComponent } from "./PacmanComponents/PacmanRenderComponent";

/**
 * Represents the player-controlled Pacman entity using composition
 */
export default class Pacman extends Entity {
  private readonly movementComponent: MovementComponent;
  private readonly collisionComponent: CircleCollisionComponent;
  private readonly mouthAnimation: MouthAnimationComponent;
  private readonly renderComponent: PacmanRenderComponent;
  private readonly lifeComponent: LifeComponent;
  
  /**
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Radius
   * @param {number} initialLives - Initial lives count
   */
  constructor(
    x: number, 
    y: number, 
    radius: number,
    initialLives: number = 2
  ) {
    super(x, y);
    
    // Create components
    this.movementComponent = new MovementComponent(this.position, 3);
    this.collisionComponent = new CircleCollisionComponent(this.position, radius);
    this.mouthAnimation = new MouthAnimationComponent();
    
    this.renderComponent = new PacmanRenderComponent(
      this.position, 
      this.mouthAnimation, 
      this.movementComponent, 
      this.collisionComponent
    );
    
    this.lifeComponent = new LifeComponent(
      (visible) => this.renderComponent.setVisible(visible),
      (invincible) => this.renderComponent.setInvincible(invincible),
      initialLives
    );    
    
    // Register components
    this.addComponent('movement', this.movementComponent);
    this.addComponent('collision', this.collisionComponent);
    this.addComponent('mouth', this.mouthAnimation);
    this.addComponent('render', this.renderComponent);
    this.addComponent('life', this.lifeComponent);
  }

  /**
   * Resize pacman
   * @param {number} radius - New radius
   */
  resize(radius: number): void {
    this.collisionComponent.setRadius(radius);
  }

  /**
   * Stop all movement
   */
  stop(): void {
    this.movementComponent.stop();
  }

  /**
   * Get the number of lives
   * @returns {number} Current lives
   */
  getLives(): number {
    return this.lifeComponent.getLives();
  }
  
  /**
   * Get pacman's radius
   * @returns {number} Current radius
   */
  getRadius(): number {
    return this.collisionComponent.getRadius();
  }

  /**
   * Add a life
   */
  addLife(): void {
    this.lifeComponent.addLife();
  }

  /**
   * Get pacman as rectangle for collision
   * @returns {Rectangle} Rectangle representation
   */
  asRect(): Rectangle {
    const radius = this.collisionComponent.getRadius();
    return {
      x: this.x - radius,
      y: this.y - radius,
      height: 2 * radius,
      width: 2 * radius
    };
  }

  /**
   * Draw pacman
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  override draw(ctx: CanvasRenderingContext2D): void {
    this.renderComponent.draw(ctx);
  }

  /**
   * Handle pacman death
   * @param {AudioManager} audioManager - Audio manager
   * @returns {boolean} True if game over
   */
  die(audioManager: AudioManager): boolean {
    const gameOver = this.lifeComponent.die(audioManager);
    
    // Stop movement if died
    if (!gameOver) {
      this.stop();
    }
    
    return gameOver;
  }

  /**
   * Make pacman temporarily invincible
   * @param {number} duration - Duration in milliseconds
   */
  setInvincible(duration: number): void {
    this.lifeComponent.setInvincible(duration);
  }

  /**
   * Update pacman state
   */
  override update(): void {
    // Update position
    this.movementComponent.update();
    
    // Update mouth animation
    this.mouthAnimation.update();
    
    // Update render component direction
    this.renderComponent.updateDirection();
  }

  /**
   * Move pacman
   * @param {string|number} signal - Movement signal
   */
  move(signal: string | number): void {
    // Convert keycode to direction string if needed
    const direction = this.getDirectionFromSignal(signal);
    this.movementComponent.moveInDirection(direction);
  }

  /**
   * Convert key code to direction
   * @param {string|number} signal - Key code or direction string
   * @returns {string} Direction string
   */
  private getDirectionFromSignal(signal: string | number): string {
    if (signal === 38 || signal === "UP") {
      return "UP";
    } else if (signal === 37 || signal === "LEFT") {
      return "LEFT";
    } else if (signal === 40 || signal === "DOWN") {
      return "DOWN";
    } else if (signal === 39 || signal === "RIGHT") {
      return "RIGHT";
    }
    return "";
  }
  
  /**
   * Set speed magnitude
   * @param {number} magnitude - New speed magnitude
   */
  setSpeedMagnitude(magnitude: number): void {
    this.movementComponent.setMagnitude(magnitude);
  }
  
  /**
   * Clean up any timers
   */
  cleanup(): void {
    this.lifeComponent.cleanup();
  }
}