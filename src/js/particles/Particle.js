export class Particle {
    
    constructor({ color, empty = false } = {}) {
      this.color = color;
      this.empty = empty;
      this.velocity = 0;
      this.maxSpeed = 0;
      this.acceleration = 0;
      this.modified = false;
    }
  
    update() {
      this.updateVelocity();
      this.modified = (this.velocity !== 0);
    }
  
    updateVelocity() {
    }
  
    tryMove(grid, x, y) {
      return { x, y };
    }
  
    resetVelocity() {
      this.velocity = 0;
    }
  
    getUpdateCount() {
      const absVelocity = Math.abs(this.velocity);
      const floored = Math.floor(absVelocity);
      const fraction = absVelocity - floored;
      return floored + (Math.random() < fraction ? 1 : 0);
    }
  }
  