import { PositionComponent } from "../types";
import { DefaultPositionComponent } from "./PacmanComponents/DefaultPositionComponent";

/**
 * Base class for all game entities using composition
 */
export default abstract class Entity {
  protected position: PositionComponent;
  protected readonly components: Map<string, any> = new Map();

  /**
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  constructor(x: number, y: number) {
    // Default position component
    this.position = new DefaultPositionComponent(x, y);
    this.components.set('position', this.position);
  }

  /**
   * Update the entity state
   * Must be implemented by subclasses
   * @param {...any} args - Update arguments
   */
  abstract update(...args: any[]): void;

  /**
   * Draw the entity
   * Must be implemented by subclasses
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {...any} args - Additional drawing arguments
   */
  abstract draw(ctx: CanvasRenderingContext2D, ...args: any[]): void;
  
  /**
   * Reposition the entity
   * @param {number} x - New X coordinate
   * @param {number} y - New Y coordinate
   */
  reposition(x: number, y: number): void {
    this.position.reposition(x, y);
  }
  
  /**
   * Get entity's x coordinate
   */
  get x(): number {
    return this.position.x;
  }
  
  /**
   * Get entity's y coordinate
   */
  get y(): number {
    return this.position.y;
  }
  
  /**
   * Set entity's x coordinate
   */
  set x(value: number) {
    this.position.x = value;
  }
  
  /**
   * Set entity's y coordinate
   */
  set y(value: number) {
    this.position.y = value;
  }
  
  /**
   * Add a component to the entity
   * @param {string} name - Component name
   * @param {any} component - Component instance
   */
  addComponent(name: string, component: any): void {
    this.components.set(name, component);
  }
  
  /**
   * Get a component by name
   * @param {string} name - Component name
   * @returns {any} Component or undefined if not found
   */
  getComponent<T>(name: string): T | undefined {
    return this.components.get(name) as T | undefined;
  }
  
  /**
   * Check if entity has a component
   * @param {string} name - Component name
   * @returns {boolean} True if component exists
   */
  hasComponent(name: string): boolean {
    return this.components.has(name);
  }
}
