import { Point, Rectangle } from '../types/index';

/**
 * Utility functions
 */

/**
 * Interface for circle objects
 */
export interface CircleShape {
  x: number;
  y: number;
  radius: number;
}

/**
 * Interface for a circular game entity that may have private radius
 */
export interface CircularEntity {
  x: number;
  y: number;
  getRadius: () => number;
  reposition: (x: number, y: number) => void;
}

/**
 * Interface for a rectangular game entity that may have private dimensions
 */
export interface RectangularEntity {
  x: number;
  y: number;
  getWidth: () => number;
  getHeight: () => number;
}

/**
 * Remove an object from an array
 * @param {T} obj - Object to remove
 * @param {Array<T>} arr - Array to remove from
 */
export function removeFromArray<T>(obj: T, arr: T[]): void {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === obj) {
      arr.splice(i, 1);
      return;
    }
  }
}

/**
 * Wipe an array
 * @param {Array<T>} arr - Array to wipe
 */
export function wipeArray<T>(arr: T[]): void {
  arr.splice(0, arr.length);
}

/**
 * Wipe multiple arrays of different types
 * @param {Array<any>[]} arrays - Arrays to wipe
 */
export function wipeArrays(arrays: Array<any>[]): void {
  arrays.forEach(arr => arr.length = 0);
}

/**
 * Check if an object exists
 * @param {T | undefined} obj - Object to check
 * @returns {boolean} True if object exists
 */
export function exists<T>(obj: T | undefined | null): obj is T {
  return typeof obj !== "undefined" && obj !== null;
}

/**
 * Check if two circles intersect
 * @param {CircleShape|CircularEntity} obj1 - First circle 
 * @param {CircleShape|CircularEntity} obj2 - Second circle
 * @returns {boolean} True if circles intersect
 */
export function circlesIntersect(
  obj1: CircleShape | CircularEntity, 
  obj2: CircleShape | CircularEntity
): boolean {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt((dx * dx) + (dy * dy));
  
  // Use radius property if available, otherwise use getRadius()
  const radius1 = 'radius' in obj1 ? obj1.radius : obj1.getRadius();
  const radius2 = 'radius' in obj2 ? obj2.radius : obj2.getRadius();
  
  return distance < (radius1 + radius2);
}

/**
 * Check if two rectangles collide
 * @param {Rectangle} rect1 - First rectangle with x, y, width, and height
 * @param {Rectangle} rect2 - Second rectangle with x, y, width, and height
 * @returns {boolean} True if rectangles collide
 */
export function rectanglesCollide(rect1: Rectangle, rect2: Rectangle): boolean {
  const dx = (rect1.x + rect1.width / 2) - (rect2.x + rect2.width / 2);
  const dy = (rect1.y + rect1.height / 2) - (rect2.y + rect2.height / 2);
  const width = (rect1.width + rect2.width) / 2;
  const height = (rect1.height + rect2.height) / 2;
  return Math.abs(dx) <= width && Math.abs(dy) <= height;
}

/**
 * Calculate distance between two points
 * @param {Point} point1 - First point with x and y
 * @param {Point} point2 - Second point with x and y
 * @returns {number} Manhattan distance
 */
export function distanceBetween(point1: Point, point2: Point): number {
  // Use manhattan distance as metric
  return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get a random element from an array
 * @param {T[]} array - Array to get random element from
 * @returns {T | undefined} Random element or undefined if array is empty
 */
export function randomElement<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}