import { PositionComponent, RenderComponent } from "../../types";
import { MovementComponent } from "../MutualComponents/MovementComponent";
import Node from '../../pathfinding/Node';

/**
 * Ghost rendering component
 */
export class GhostRenderComponent implements RenderComponent {
    private readonly position: PositionComponent;
    private readonly movementComponent: MovementComponent;
    private readonly width: number;
    private readonly height: number;
    private bodyColor: string;
    private borderColor: string;

    /**
     * @param {PositionComponent} position - Position component
     * @param {MovementComponent} movementComponent - Movement component
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} color - Body color
     */
    constructor(
        position: PositionComponent,
        movementComponent: MovementComponent,
        width: number,
        height: number,
        color: string = 'green'
    ) {
        this.position = position;
        this.movementComponent = movementComponent;
        this.width = width;
        this.height = height;
        this.bodyColor = color;
        this.borderColor = "black";
    }

    /**
     * Draw the ghost
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {boolean} isScared - Whether ghost is scared
     * @param {boolean} showPath - Whether to show path
     * @param {number} tileSize - Tile size
     * @param {Node[]} path - Current path
     */
    draw(
        ctx: CanvasRenderingContext2D,
        isScared: boolean,
        showPath: boolean,
        tileSize: number,
        path: Node[]
    ): void {
        // Draw ghost body based on state
        if (isScared) {
            this.drawScaredGhost(ctx);
        } else {
            this.drawNormalGhost(ctx);
        }

        // Draw path if visible
        if (showPath) {
            this.drawPath(ctx, isScared, tileSize, path);
        }
    }

    /**
     * Draw the ghost in normal state
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    private drawNormalGhost(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = this.bodyColor;

        // Draw the upper semi-circle (ghost's head)
        ctx.arc(this.position.x, this.position.y, this.width, Math.PI, 2 * Math.PI);

        // Draw the body with the wavy bottom
        ctx.lineTo(this.position.x + this.width, this.position.y + this.height);

        // Draw the waves at the bottom
        ctx.arc(this.position.x + this.width / 2, this.position.y + this.height, this.width * 0.5, 0, Math.PI);
        ctx.arc(this.position.x + this.width / 2 - this.width, this.position.y + this.height, this.width * 0.5, 0, Math.PI);

        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();

        // Draw normal eyes
        this.drawNormalEyes(ctx);
    }

    /**
     * Draw the ghost in scared state
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    private drawScaredGhost(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = "blue";

        // Draw the upper semi-circle (ghost's head)
        ctx.arc(this.position.x, this.position.y, this.width, Math.PI, 2 * Math.PI);

        // Draw the body with the wavy bottom
        ctx.lineTo(this.position.x + this.width, this.position.y + this.height);

        // Draw the waves at the bottom
        ctx.arc(this.position.x + this.width / 2, this.position.y + this.height, this.width * 0.5, 0, Math.PI);
        ctx.arc(this.position.x + this.width / 2 - this.width, this.position.y + this.height, this.width * 0.5, 0, Math.PI);

        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = this.borderColor;
        ctx.stroke();

        // Draw scared eyes
        this.drawScaredEyes(ctx);
    }

    /**
     * Draw normal eyes
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    private drawNormalEyes(ctx: CanvasRenderingContext2D): void {
        const eyeOffsetX = this.width * 0.4;
        const eyeRadius = this.width * 0.25;
        const pupilRadius = eyeRadius * 0.5;

        // Get movement information from movement component
        const speed = this.movementComponent.getSpeed();

        // Determine pupil position based on movement direction
        let pupilOffsetX = 0;
        let pupilOffsetY = 0;

        if (speed.dx > 0) pupilOffsetX = pupilRadius * 0.6;
        else if (speed.dx < 0) pupilOffsetX = -pupilRadius * 0.6;

        if (speed.dy > 0) pupilOffsetY = pupilRadius * 0.6;
        else if (speed.dy < 0) pupilOffsetY = -pupilRadius * 0.6;

        // Draw left eye
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.position.x - eyeOffsetX, this.position.y - this.height * 0.1, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw left pupil
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(
            this.position.x - eyeOffsetX + pupilOffsetX,
            this.position.y - this.height * 0.1 + pupilOffsetY,
            pupilRadius, 0, Math.PI * 2
        );
        ctx.fill();

        // Draw right eye
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.position.x + eyeOffsetX, this.position.y - this.height * 0.1, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw right pupil
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(
            this.position.x + eyeOffsetX + pupilOffsetX,
            this.position.y - this.height * 0.1 + pupilOffsetY,
            pupilRadius, 0, Math.PI * 2
        );
        ctx.fill();
    }

    /**
     * Draw scared eyes (X shapes)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    private drawScaredEyes(ctx: CanvasRenderingContext2D): void {
        const eyeOffsetX = this.width * 0.4;
        const eyeRadius = this.width * 0.25;

        // Left eye
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(this.position.x - eyeOffsetX - eyeRadius, this.position.y - eyeRadius);
        ctx.lineTo(this.position.x - eyeOffsetX + eyeRadius, this.position.y + eyeRadius);
        ctx.moveTo(this.position.x - eyeOffsetX - eyeRadius, this.position.y + eyeRadius);
        ctx.lineTo(this.position.x - eyeOffsetX + eyeRadius, this.position.y - eyeRadius);
        ctx.stroke();

        // Right eye
        ctx.beginPath();
        ctx.moveTo(this.position.x + eyeOffsetX - eyeRadius, this.position.y - eyeRadius);
        ctx.lineTo(this.position.x + eyeOffsetX + eyeRadius, this.position.y + eyeRadius);
        ctx.moveTo(this.position.x + eyeOffsetX - eyeRadius, this.position.y + eyeRadius);
        ctx.lineTo(this.position.x + eyeOffsetX + eyeRadius, this.position.y - eyeRadius);
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    /**
     * Draw the ghost's path
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {boolean} isScared - Whether ghost is scared
     * @param {number} tileSize - Tile size
     * @param {Node[]} path - Current path
     */
    private drawPath(
        ctx: CanvasRenderingContext2D,
        isScared: boolean,
        tileSize: number,
        path: Node[]
    ): void {
        const pathColor = isScared ? "blue" : "red";

        ctx.beginPath();
        ctx.strokeStyle = pathColor;
        ctx.setLineDash([5, 5]); // Dashed line
        ctx.moveTo(this.position.x, this.position.y);

        // Draw lines along the path
        for (let i = 1; i < path.length; i++) {
            const node = path[i];
            ctx.lineTo(
                node.x * tileSize + tileSize / 2,
                node.y * tileSize + tileSize / 2
            );
        }

        // Draw endpoint
        const lastNode = path[path.length - 1];
        if (lastNode) {
            ctx.arc(
                lastNode.x * tileSize + tileSize / 2,
                lastNode.y * tileSize + tileSize / 2,
                3, 0, 2 * Math.PI
            );
        }

        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
    }

    /**
     * Set body color
     * @param {string} color - New color
     */
    setBodyColor(color: string): void {
        this.bodyColor = color;
    }

    /**
    * Get body color
    * @returns {string} Current body color
    */
    getBodyColor(): string {
        return this.bodyColor;
    }

    /**
     * Set border color
     * @param {string} color - New color
     */
    setBorderColor(color: string): void {
        this.borderColor = color;
    }

    /**
     * Get width
     * @returns {number} Width
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Get height
     * @returns {number} Height
     */
    getHeight(): number {
        return this.height;
    }
}