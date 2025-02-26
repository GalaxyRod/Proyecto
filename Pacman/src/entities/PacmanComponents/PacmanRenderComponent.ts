import { Direction, PositionComponent, RenderComponent } from "../../types";
import { CircleCollisionComponent } from "./CircleCollisionComponent";
import { MouthAnimationComponent } from "./MouthAnimationComponent";
import { MovementComponent } from "../MutualComponents/MovementComponent";

/**
 * Renders Pacman
 */
export class PacmanRenderComponent implements RenderComponent {
  private readonly position: PositionComponent;
  private readonly mouthAnimation: MouthAnimationComponent;
  private readonly movementComponent: MovementComponent;
  private readonly collisionComponent: CircleCollisionComponent;
  private direction: Direction;
  private visible: boolean;
  private invincible: boolean;

  /**
   * @param {PositionComponent} position - Position component
   * @param {MouthAnimationComponent} mouthAnimation - Mouth animation component
   * @param {MovementComponent} movementComponent - Movement component
   * @param {CircleCollisionComponent} collisionComponent - Collision component
   */
  constructor(
    position: PositionComponent,
    mouthAnimation: MouthAnimationComponent,
    movementComponent: MovementComponent,
    collisionComponent: CircleCollisionComponent
  ) {
    this.position = position;
    this.mouthAnimation = mouthAnimation;
    this.movementComponent = movementComponent;
    this.collisionComponent = collisionComponent;
    this.direction = { name: "RIGHT", angle: 0 };
    this.visible = true;
    this.invincible = false;
  }

  /**
   * Set direction
   * @param {Direction} direction - New direction
   */
  setDirection(direction: Direction): void {
    this.direction = direction;
  }

  /**
   * Set visibility
   * @param {boolean} visible - Whether Pacman is visible
   */
  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  /**
   * Set invincibility
   * @param {boolean} invincible - Whether Pacman is invincible
   */
  setInvincible(invincible: boolean): void {
    this.invincible = invincible;
  }

  /**
   * Draw pacman
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx: CanvasRenderingContext2D): void {
    // Skip drawing if blinking and not visible
    if (!this.visible && this.invincible) {
      return;
    }

    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    // Want to flip only if going left
    if (this.direction.name === "LEFT") {
      ctx.scale(1, -1);
    }

    ctx.rotate(this.direction.angle);
    ctx.translate(-this.position.x, -this.position.y);

    // Draw pacman body with mouth animation
    const mouthAngle = this.mouthAnimation.getAngle();
    const radius = this.collisionComponent.getRadius();

    ctx.beginPath();
    ctx.arc(
      this.position.x, this.position.y, radius,
      Math.PI / 4 - mouthAngle,
      Math.PI * 1.75 + mouthAngle
    );
    ctx.lineTo(this.position.x, this.position.y);

    // Calculate the final position using co-ordinate transformation
    const newX = radius * Math.cos(Math.PI / 4 - mouthAngle) + this.position.x;
    const newY = radius * Math.sin(Math.PI / 4 - mouthAngle) + this.position.y;
    ctx.lineTo(newX, newY);

    // Fill and stroke
    ctx.fillStyle = this.invincible ? "rgba(255, 255, 0, 0.7)" : "yellow";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw the eye
    this.drawEye(ctx, radius);

    ctx.restore();
  }

  /**
   * Draw pacman's eye
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} radius - Pacman radius
   */
  private drawEye(ctx: CanvasRenderingContext2D, radius: number): void {
    ctx.beginPath();
    ctx.arc(
      this.position.x, this.position.y - radius / 2, // go halfway up from the midpoint
      radius * 0.15, // 15% of pacman's radius
      0, 2 * Math.PI
    );
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  /**
   * Update direction from movement component
   */
  updateDirection(): void {
    const directionName = this.movementComponent.getDirection();
    if (directionName === "NONE") return;

    let angle: number;

    switch (directionName) {
      case "UP":
        angle = Math.PI * (3 / 2);
        break;
      case "DOWN":
        angle = Math.PI / 2;
        break;
      case "LEFT":
        angle = Math.PI;
        break;
      case "RIGHT":
      default:
        angle = 0;
        break;
    }

    this.direction = {
      name: directionName,
      angle: angle
    };
  }
}