import { Particle } from './Particle.js';

export class Smoke extends Particle {
  constructor({ color, lifespan = 200 }) {
    super({ color, empty: false });
    this.maxSpeed = 3;
    this.acceleration = 0.2;
    this.velocity = 0;
    this.lifespan = lifespan;
    this.maxLifespan = lifespan;
  }

  updateVelocity() {
    let newVelocity = this.velocity - this.acceleration;
    if (Math.abs(newVelocity) > this.maxSpeed) {
      newVelocity = -this.maxSpeed;
    }
    this.velocity = newVelocity;
  }

  update() {
    super.update();
    
    this.lifespan--;
    
    const lifePercent = this.lifespan / this.maxLifespan;
    const alpha = lifePercent * 0.7;
    const greyValue = Math.floor(100 + lifePercent * 80);
    this.color = `rgba(${greyValue}, ${greyValue}, ${greyValue}, ${alpha})`;

    this.modified = true;
  }

  tryMove(grid, x, y) {
    if (this.lifespan <= 0) {
      return { x, y };
    }
    
    const above = (y > 0) ? { x, y: y - 1 } : null;
    const aboveLeft = (x > 0 && y > 0) ? { x: x - 1, y: y - 1 } : null;
    const aboveRight = (x < grid.width - 1 && y > 0) ? { x: x + 1, y: y - 1 } : null;
    
    if (Math.random() < 0.7) {
      if (above && grid.isEmpty(above.x, above.y)) {
        return above;
      }
    }

    if (Math.random() < 0.5) {
      if (aboveLeft && grid.isEmpty(aboveLeft.x, aboveLeft.y)) {
        return aboveLeft;
      }
      if (aboveRight && grid.isEmpty(aboveRight.x, aboveRight.y)) {
        return aboveRight;
      }
    } else {
      if (aboveRight && grid.isEmpty(aboveRight.x, aboveRight.y)) {
        return aboveRight;
      }
      if (aboveLeft && grid.isEmpty(aboveLeft.x, aboveLeft.y)) {
        return aboveLeft;
      }
    }
    
    if (Math.random() < 0.3) {
      const left = (x > 0) ? { x: x - 1, y } : null;
      const right = (x < grid.width - 1) ? { x: x + 1, y } : null;
      
      if (Math.random() < 0.5) {
        if (left && grid.isEmpty(left.x, left.y)) {
          return left;
        }
      } else {
        if (right && grid.isEmpty(right.x, right.y)) {
          return right;
        }
      }
    }
    
    return { x, y };
  }
  
  getUpdateCount() {
    return Math.random() < 0.7 ? 1 : 0;
  }
}