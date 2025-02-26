import { PositionComponent } from "../../types";

/**
 * Default position component
 */
export class DefaultPositionComponent implements PositionComponent {
    constructor(public x: number, public y: number) {}
    
    reposition(x: number, y: number): void {
      this.x = x;
      this.y = y;
    }
  }