export class Canvas {
    
    constructor(canvasId, width, height) {
      this.canvas = document.getElementById(canvasId);
      this.width = width;
      this.height = height;
      this.canvas.width = width;
      this.canvas.height = height;
  
      this.ctx = this.canvas.getContext("2d");
    }
  
    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  
    drawRect(x, y, w, h, color) {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, w, h);
    }
  }
  