/**
 * Base class for UI components
 */
export default abstract class UIComponent {
    protected readonly ctx: CanvasRenderingContext2D;
    protected readonly width: number;
    protected readonly height: number;
    
    /**
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Component width
     * @param {number} height - Component height
     */
    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    
    /**
     * Draw the component
     * Each subclass must implement this method
     */
    abstract draw(...args: any[]): void;
}