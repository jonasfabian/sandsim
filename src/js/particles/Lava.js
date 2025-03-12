import { Particle } from './Particle.js';
import { ParticleFactory } from './ParticleFactory.js';
import { Empty } from './Empty.js';

export class Lava extends Particle {
  constructor({ color, temperature = 1200 }) {
    super({ color, empty: false });
    this.maxSpeed = 4;
    this.acceleration = 0.4;
    this.velocity = 0;
    this.temperature = temperature;
    this.heatRadius = 3;
    this.coolRate = 0.2;
    this.solidified = false;
    this.flickerTimer = Math.random() * 10;
    this.glowIntensity = Math.random() * 0.3 + 0.7;
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
  
    this.temperature -= this.coolRate;
    
    this.flickerTimer += 0.1;
    this.glowIntensity = 0.7 + (Math.sin(this.flickerTimer) * 0.3);
    
    this.updateColor();
    
    if (this.temperature < 600) {
      this.solidified = true;
    }
    
    this.modified = true;
  }
  
  updateColor() {
    const tempPercent = Math.min(1, Math.max(0, (this.temperature - 600) / 1000));
    
    const glow = this.glowIntensity;
    
    const r = Math.floor(255 * glow);
    const g = Math.floor((140 + (tempPercent * 80)) * glow);
    const b = Math.floor((40 + tempPercent * 20) * glow);
    
    this.color = `rgba(${r}, ${g}, ${b}, 0.9)`;
  }

  tryMove(grid, x, y) {
    if (this.empty) return { x, y };
    
    if (this.solidified) {
      return { x, y };
    }

    this.spreadHeat(grid, x, y);
    
    this.checkInteractions(grid, x, y);

    const below = (y < grid.height - 1) ? { x, y: y + 1 } : null;
    const belowLeft = (x > 0 && y < grid.height - 1) ? { x: x - 1, y: y + 1 } : null;
    const belowRight = (x < grid.width - 1 && y < grid.height - 1) ? { x: x + 1, y: y + 1 } : null;

    if (below && grid.isEmpty(below.x, below.y)) {
      return below;
    }
    
    if (below) {
      const belowParticle = grid.get(below.x, below.y);
      if (belowParticle.constructor.name === 'Water') {
        grid.set(below.x, below.y, ParticleFactory.createStone());
        this.temperature -= 100;
        if (Math.random() < 0.7) {
          return below;
        }
        return { x, y };
      }
    }

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
    
    if (belowLeft) {
      const belowLeftParticle = grid.get(belowLeft.x, belowLeft.y);
      if (belowLeftParticle.constructor.name === 'Water') {
        grid.set(belowLeft.x, belowLeft.y, ParticleFactory.createStone());
        this.temperature -= 100;
        if (Math.random() < 0.5) {
          return belowLeft;
        }
      }
    }
    
    if (belowRight) {
      const belowRightParticle = grid.get(belowRight.x, belowRight.y);
      if (belowRightParticle.constructor.name === 'Water') {
        grid.set(belowRight.x, belowRight.y, ParticleFactory.createStone());
        this.temperature -= 100;
        if (Math.random() < 0.5) {
          return belowRight;
        }
      }
    }

    if (Math.random() < 0.3) {
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
      
      if (left) {
        const leftParticle = grid.get(left.x, left.y);
        if (leftParticle.constructor.name === 'Water') {
          grid.set(left.x, left.y, ParticleFactory.createStone());
          this.temperature -= 100;
          if (Math.random() < 0.3) {
            return left;
          }
        }
      }
      
      if (right) {
        const rightParticle = grid.get(right.x, right.y);
        if (rightParticle.constructor.name === 'Water') {
          grid.set(right.x, right.y, ParticleFactory.createStone());
          this.temperature -= 100;
          if (Math.random() < 0.3) {
            return right;
          }
        }
      }
    }

    return { x, y };
  }
  
  spreadHeat(grid, x, y) {
    for (let i = -this.heatRadius; i <= this.heatRadius; i++) {
      for (let j = -this.heatRadius; j <= this.heatRadius; j++) {
        if ((i === 0 && j === 0) || 
            x + i < 0 || x + i >= grid.width || 
            y + j < 0 || y + j >= grid.height) {
          continue;
        }
        
        const distance = Math.sqrt(i*i + j*j);
        if (distance > this.heatRadius) continue;
        
        const targetX = x + i;
        const targetY = y + j;
        const particle = grid.get(targetX, targetY);
        
        if (particle.constructor.name === 'Sand' && distance <= 1.5 && Math.random() < 0.01) {
          grid.set(targetX, targetY, ParticleFactory.createGlass());
        }
        else if (particle.constructor.name === 'Oil' && Math.random() < 0.2) {
          grid.set(targetX, targetY, ParticleFactory.createFire());
        }
        else if (particle.constructor.name === 'Gunpowder' && Math.random() < 0.5) {
          if (Math.random() < 0.5) {
            const gunpowder = particle;
            gunpowder.explode(grid, targetX, targetY);
          } else {
            grid.set(targetX, targetY, ParticleFactory.createFire());
          }
        }
        else if (particle.constructor.name === 'Water' && distance <= 1) {
          grid.set(targetX, targetY, ParticleFactory.createStone());
          this.temperature -= 50;
        }
      }
    }
  }
  
  checkInteractions(grid, x, y) {
    const positions = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
    
    for (const pos of positions) {
      if (pos.x < 0 || pos.x >= grid.width || pos.y < 0 || pos.y >= grid.height) {
        continue;
      }
      
      const particle = grid.get(pos.x, pos.y);
    
      if (particle.constructor.name === 'Water') {
        grid.set(pos.x, pos.y, ParticleFactory.createStone());
        this.temperature -= 100;
        
        if (Math.random() < 0.3) {
          const abovePos = { x: pos.x, y: pos.y - 1 };
          if (abovePos.y >= 0 && grid.isEmpty(abovePos.x, abovePos.y)) {
            grid.set(abovePos.x, abovePos.y, ParticleFactory.createSmoke());
          }
        }
      }
      else if (particle.constructor.name === 'Acid') {
        grid.set(pos.x, pos.y, ParticleFactory.createSmoke());
        this.temperature -= 20;
      }
    }
  }
  
  getUpdateCount() {
    if (this.solidified) return 0;
    return Math.random() < 0.7 ? 1 : 0;
  }
}