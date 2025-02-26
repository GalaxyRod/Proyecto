/**
 * Node for pathfinding
 */
export default class Node {
    isPassable: boolean;
    neighbours: Node[];
    x: number;
    y: number;
    prev: Node | null;
  
    /**
     * @param {boolean} isPassable - Whether the node is passable
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    constructor(isPassable: boolean, x: number, y: number) {
      this.isPassable = isPassable; // if it can be traversed
      this.neighbours = []; // the connected nodes
      this.x = x;
      this.y = y;
      this.prev = null; // Previous node in path
    }
  
    /**
     * Reset the node for pathfinding
     */
    reset(): void {
      this.prev = null;
    }
  }