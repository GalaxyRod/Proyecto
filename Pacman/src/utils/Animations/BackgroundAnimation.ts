/**
 * Handles background animation effects
 */
export default class BackgroundAnimation {
    private readonly image: HTMLImageElement;
    private scale: number;
    private zoomingIn: boolean;
    private ticks: number;
    private maxTicks: number;
    private zoomRate: number;
    
    /**
     * @param {string} imagePath - Path to background image
     * @param {number} initialScale - Initial scale factor
     * @param {number} zoomRate - Rate of zoom animation (smaller = slower)
     * @param {number} maxTicks - Number of frames before changing zoom direction
     */
    constructor(
      imagePath: string, 
      initialScale: number = 1.0, 
      zoomRate: number = 0.001,
      maxTicks: number = 400
    ) {
      this.image = new Image();
      this.image.src = imagePath;
      this.scale = initialScale;
      this.zoomingIn = true;
      this.ticks = 0;
      this.maxTicks = maxTicks;
      this.zoomRate = zoomRate;
    }
    
    /**
     * Update animation state
     */
    update(): void {
      this.ticks++; // Counter to indicate the zooming should happen in reverse
      
      if (this.ticks >= this.maxTicks) {
        this.ticks = 0; // Reset the counter
        this.zoomingIn = !this.zoomingIn; // Toggle direction
      }
      
      if (this.zoomingIn) {
        this.scale += this.zoomRate;
      } else {
        this.scale -= this.zoomRate;
      }
    }
    
    /**
     * Draw the animated background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
      ctx.save();
      
      // Scale using transform
      ctx.transform(this.scale, 0, 0, this.scale, 0, 0);
      ctx.drawImage(this.image, 0, 0, width / this.scale, height / this.scale);
      
      ctx.restore();
    }
    
    /**
     * Set zoom rate
     * @param {number} rate - New zoom rate
     */
    setZoomRate(rate: number): void {
      this.zoomRate = rate;
    }
    
    /**
     * Set max ticks before direction change
     * @param {number} ticks - New max ticks
     */
    setMaxTicks(ticks: number): void {
      this.maxTicks = ticks;
    }
    
    /**
     * Change background image
     * @param {string} imagePath - New image path
     */
    changeImage(imagePath: string): void {
      this.image.src = imagePath;
    }
}