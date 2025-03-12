import { Particle } from './Particle.js';
import { ParticleFactory } from './ParticleFactory.js';
import { Empty } from './Empty.js';

export class Ice extends Particle {
  constructor({ color, temperature = -10, slippery = true }) {
    super({ color, empty: false });
    this.maxSpeed = 4;
    this.acceleration = 0.2;
    this.velocity = 0;
    this.temperature = temperature;
    this.slippery = slippery;
    this.freezeRadius = 1;
    this.meltRate = 0.2;
    this.melting = false;
  }

  updateVelocity() {
    let newVelocity = this.velocity + this.acceleration;
    if (Math.abs(newVelocity) > this.maxSpeed) {
      newVelocity = Math.sign(newVelocity) * this.maxSpeed;
    }
    this.velocity = newVelocity;
  }

  update() {
    super.update();
    
    if (this.melting) {
      this.temperature += this.meltRate;
      
      const meltPercent = Math.min(1, Math.max(0, (this.temperature + 20) / 30));
      const alpha = 0.5 + (1 - meltPercent) * 0.5;
      const b = Math.floor(230 + meltPercent * 25);
      this.color = `rgba(200, 220, ${b}, ${alpha})`;
      
      if (this.temperature > 0) {
        this.melting = true;
      }
    }
    
    this.modified = true;
  }

  tryMove(grid, x, y) {
    if (this.empty) return { x, y };
    
    if (this.melting && this.temperature > 0) {
      return { x, y };
    }
    
    this.freezeWater(grid, x, y);
    
    this.checkForHeat(grid, x, y);
    
    const below = (y < grid.height - 1) ? { x, y: y + 1 } : null;
    
    if (below && grid.isEmpty(below.x, below.y)) {
      return below;
    }
    
    if (this.slippery && Math.random() < 0.4) {
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
    }
    
    if (Math.random() < 0.3) {
      const belowLeft = (x > 0 && y < grid.height - 1) ? { x: x - 1, y: y + 1 } : null;
      const belowRight = (x < grid.width - 1 && y < grid.height - 1) ? { x: x + 1, y: y + 1 } : null;
      
      if (Math.random() < 0.5) {
        if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
          return belowLeft;
        }
        if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
          return belowRight;
        }
      } else {
        if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
          return belowRight;
        }
        if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
          return belowLeft;
        }
      }
    }
    
    return { x, y };
  }
  
  freezeWater(grid, x, y) {
    for (let i = -this.freezeRadius; i <= this.freezeRadius; i++) {
      for (let j = -this.freezeRadius; j <= this.freezeRadius; j++) {
        if (i === 0 && j === 0) continue;
        
        const targetX = x + i;
        const targetY = y + j;
        
        if (targetX >= 0 && targetX < grid.width && targetY >= 0 && targetY < grid.height) {
          const particle = grid.get(targetX, targetY);
          
          if (particle.constructor.name === 'Water') {
            if (Math.random() < 0.08) {
              grid.set(targetX, targetY, ParticleFactory.createIce());
            }
          }
        }
      }
    }
  }
  
  checkForHeat(grid, x, y) {
    const positions = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
    
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height) {
        const particle = grid.get(pos.x, pos.y);
        
        if (particle.constructor.name === 'Fire') {
          this.temperature += 2;
          this.melting = true;
        }
        else if (particle.constructor.name === 'Lava') {
          this.temperature += 5;
          this.melting = true;
          
          if (Math.random() < 0.5) {
            return true;
          }
        }
      }
    }
    
    return this.melting;
  }
}