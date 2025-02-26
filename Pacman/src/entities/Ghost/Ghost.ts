import AudioManager from "../../utils/Managers/AudioManager";
import Entity from "../Entity";
import Node from '../../pathfinding/Node';
import { GhostRenderComponent } from "../GhostComponents/GhostRenderComponent";
import { PathfindingComponent } from "../GhostComponents/PathfindingComponent";
import { MovementComponent } from "../MutualComponents/MovementComponent";
import { ChaserBehavior, GhostBehavior } from "./GhostBehavior";

/**
 * Ghost entity with configurable behavior using composition
 */
export default class Ghost extends Entity {
  private readonly movementComponent: MovementComponent;
  private readonly renderComponent: GhostRenderComponent;
  private readonly pathfindingComponent: PathfindingComponent;
  private behavior: GhostBehavior;
  private readonly width: number;
  private readonly height: number;

  /**
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {string} color - Ghost color
   * @param {GhostBehavior} behavior - Ghost behavior strategy
   */
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string = 'green',
    behavior: GhostBehavior = new ChaserBehavior()
  ) {
    super(x, y);

    this.width = width;
    this.height = height;
    this.behavior = behavior;

    // Create components
    this.movementComponent = new MovementComponent(this.position, 0.8);

    this.renderComponent = new GhostRenderComponent(
      this.position,
      this.movementComponent,
      width,
      height,
      color
    );

    // The movement component now implements the MovementController interface needed by PathfindingComponent
    this.pathfindingComponent = new PathfindingComponent(
      this.position,
      this.movementComponent,
      30 // Update frequency
    );

    // Register components
    this.addComponent('movement', this.movementComponent);
    this.addComponent('render', this.renderComponent);
    this.addComponent('pathfinding', this.pathfindingComponent);
  }

  /**
   * Draw the ghost
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {boolean} isScared - Whether ghost is scared
   * @param {boolean} showPath - Whether to show path
   * @param {number} tileSize - Tile size
   */
  override draw(
    ctx: CanvasRenderingContext2D,
    isScared: boolean = false,
    showPath: boolean = false,
    tileSize: number = 30
  ): void {
    // Now using our own getPath method that follows Law of Demeter
    const path = this.getPath();
    this.renderComponent.draw(
      ctx,
      isScared,
      showPath,
      tileSize,
      path
    );
  }

  /**
   * Get the ghost's current path
   * @returns {Node[]} Current path
   */
  getPath(): Node[] {
    return this.pathfindingComponent.getPath();
  }

  /**
   * Handle ghost death
   * @param {AudioManager} audioManager - Audio manager
   * @param {Function} getRandomPoint - Function to get a random point
   * @param {Function} _getPoint - Function to get a point from coordinates
   * @returns {Ghost} New ghost instance
   */
  die(
    audioManager: AudioManager,
    getRandomPoint: () => Node,
    _getPoint: (x: number, y: number) => Node
  ): Ghost {
    audioManager.play('eatGhost');

    // Create a new ghost at the same position
    const newGhost = new Ghost(
      this.x, this.y,
      this.width, this.height,
      this.renderComponent.getBodyColor(),
      this.behavior // Keep the same behavior
    );

    // Set its destination and current point
    const randomPoint = getRandomPoint();
    newGhost.pathfindingComponent.setDestination(randomPoint);

    return newGhost;
  }

  /**
   * Change the ghost's behavior
   * @param {GhostBehavior} newBehavior - New behavior
   */
  setBehavior(newBehavior: GhostBehavior): void {
    this.behavior = newBehavior;
  }

  /**
   * Get the ghost's current behavior name
   * @returns {string} Behavior name
   */
  getBehaviorName(): string {
    return this.behavior.getName();
  }

  /**
   * Update ghost state
   * @param {number} time - Current game time
   * @param {boolean} isScared - Whether ghosts are scared
   * @param {Function} getPacmanPoint - Function to get pacman's point
   * @param {Function} getPoint - Function to get a point from coordinates
   * @param {Function} getRandomPoint - Function to get a random point
   */
  override update(
    _time: number,
    isScared: boolean,
    getPacmanPoint: () => Node,
    getPoint: (x: number, y: number) => Node,
    getRandomPoint: () => Node
  ): void {
    // Update position
    this.movementComponent.update();

    // Update pathfinding
    const pacmanPoint = getPacmanPoint();

    // Update the ghost's color based on state - now using the getter for path
    const path = this.getPath();
    if (path.length > 0 && path[path.length - 1] === pacmanPoint && !isScared) {
      this.renderComponent.setBorderColor("red");
    } else {
      this.renderComponent.setBorderColor("black");
    }

    // Update pathfinding
    this.pathfindingComponent.update(
      getPoint,
      getRandomPoint,
      pacmanPoint,
      isScared,
      this.behavior
    );
  }

  /**
   * Set update frequency for pathfinding
   * @param {number} frequency - Frames between updates
   */
  setUpdateFrequency(frequency: number): void {
    this.pathfindingComponent.setUpdateFrequency(frequency);
  }

  /**
   * Get ghost width
   * @returns {number} Ghost width
   */
  getWidth(): number {
    return this.renderComponent.getWidth();
  }

  /**
   * Get ghost height
   * @returns {number} Ghost height
   */
  getHeight(): number {
    return this.renderComponent.getHeight();
  }

  /**
   * Set ghost color
   * @param {string} color - New color
   */
  setColor(color: string): void {
    this.renderComponent.setBodyColor(color);
  }

  /**
   * Set speed magnitude
   * @param {number} magnitude - New speed magnitude
   */
  setSpeedMagnitude(magnitude: number): void {
    this.movementComponent.setMagnitude(magnitude);
  }

  /**
   * Check if the ghost has a path
   * @returns {boolean} True if the ghost has a path
   */
  hasPath(): boolean {
    return this.pathfindingComponent.hasPath();
  }

  /**
   * Get the current destination
   * @returns {Node|null} Current destination node
   */
  getDestination(): Node | null {
    return this.pathfindingComponent.getDestination();
  }
}