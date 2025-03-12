import { Particle } from './Particle.js';
import { Empty } from './Empty.js';
import { ParticleFactory } from './ParticleFactory.js';

export class Fire extends Particle {
  constructor({ color, lifespan = 100 }) {
    super({ color, empty: false });
    this.maxSpeed = 6;
    this.acceleration = 0.8;
    this.velocity = 0;
    this.lifespan = lifespan;
    this.maxLifespan = lifespan;
    this.spreadChance = 0.05;
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
    const r = Math.floor(255);
    const g = Math.floor(lifePercent * 200);
    const b = Math.floor(lifePercent * 50);
    this.color = `rgba(${r}, ${g}, ${b}, 0.8)`;
    
    this.modified = true;
  }

  tryMove(grid, x, y) {
    if (this.lifespan <= 0) {
      if (Math.random() < 0.3) {
      }
      return { x, y };
    }

    this.trySpreadFire(grid, x, y);
    
    const above = (y > 0) ? { x, y: y - 1 } : null;
    const aboveLeft = (x > 0 && y > 0) ? { x: x - 1, y: y - 1 } : null;
    const aboveRight = (x < grid.width - 1 && y > 0) ? { x: x + 1, y: y - 1 } : null;
    
    if (above && grid.isEmpty(above.x, above.y)) {
      return above;
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
    
    const left = (x > 0) ? { x: x - 1, y } : null;
    const right = (x < grid.width - 1) ? { x: x + 1, y } : null;
    
    if (Math.random() < 0.5) {
      if (left && grid.isEmpty(left.x, left.y)) {
        return left;
      }
      if (right && grid.isEmpty(right.x, right.y)) {
        return right;
      }
    } else {
      if (right && grid.isEmpty(right.x, right.y)) {
        return right;
      }
      if (left && grid.isEmpty(left.x, left.y)) {
        return left;
      }
    }
    
    return { x, y };
  }
  
  trySpreadFire(grid, x, y) {
    const positions = [
      { x: x, y: y - 1 },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x - 1, y: y },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y + 1 },
      { x: x - 1, y: y - 1 }
    ];
    
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height) {
        const particle = grid.get(pos.x, pos.y);
        
        if (particle.constructor.name === 'Oil' && Math.random() < this.spreadChance * 5) {
          grid.set(pos.x, pos.y, ParticleFactory.createFire());
        }
      }
    }
  }
  
  getUpdateCount() {
    return Math.max(1, Math.floor(Math.random() * 3));
  }
  
  resetVelocity() {
    this.velocity = this.velocity * 0.5;
  }
}