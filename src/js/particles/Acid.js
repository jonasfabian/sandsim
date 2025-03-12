import { Particle } from './Particle.js';
import { ParticleFactory } from './ParticleFactory.js';
import { Empty } from './Empty.js';

export class Acid extends Particle {
  constructor({ color, potency = 100 }) {
    super({ color, empty: false });
    this.maxSpeed = 10;
    this.acceleration = 0.8;
    this.velocity = 0;
    this.potency = potency;
    this.dissolveChance = 0.2;
    this.reactedThisFrame = false;
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
    this.reactedThisFrame = false;
    
    const alpha = 0.3 + (this.potency / 100) * 0.7;
    const greenValue = 180 + Math.floor((this.potency / 100) * 75);
    this.color = `rgba(80, ${greenValue}, 70, ${alpha})`;
    
    this.modified = true;
  }

  tryMove(grid, x, y) {
    if (this.empty) return { x, y };
    
    if (!this.reactedThisFrame) {
      this.checkForReactions(grid, x, y);
    }
    
    if (this.potency <= 0) {
      return { x, y };
    }

    const below = (y < grid.height - 1) ? { x, y: y + 1 } : null;
    const belowLeft = (x > 0 && y < grid.height - 1) ? { x: x - 1, y: y + 1 } : null;
    const belowRight = (x < grid.width - 1 && y < grid.height - 1) ? { x: x + 1, y: y + 1 } : null;

    if (below && grid.isEmpty(below.x, below.y)) {
      return below;
    }
    
    if (below) {
      const belowParticle = grid.get(below.x, below.y);
      if (this.canDissolve(belowParticle)) {
        this.dissolveParticle(grid, below.x, below.y);
        this.reactedThisFrame = true;
        return below;
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
    
    if (!this.reactedThisFrame) {
      if (Math.random() < 0.5) {
        if (belowLeft) {
          const belowLeftParticle = grid.get(belowLeft.x, belowLeft.y);
          if (this.canDissolve(belowLeftParticle)) {
            this.dissolveParticle(grid, belowLeft.x, belowLeft.y);
            this.reactedThisFrame = true;
            return belowLeft;
          }
        }
        if (belowRight) {
          const belowRightParticle = grid.get(belowRight.x, belowRight.y);
          if (this.canDissolve(belowRightParticle)) {
            this.dissolveParticle(grid, belowRight.x, belowRight.y);
            this.reactedThisFrame = true;
            return belowRight;
          }
        }
      } else {
        if (belowRight) {
          const belowRightParticle = grid.get(belowRight.x, belowRight.y);
          if (this.canDissolve(belowRightParticle)) {
            this.dissolveParticle(grid, belowRight.x, belowRight.y);
            this.reactedThisFrame = true;
            return belowRight;
          }
        }
        if (belowLeft) {
          const belowLeftParticle = grid.get(belowLeft.x, belowLeft.y);
          if (this.canDissolve(belowLeftParticle)) {
            this.dissolveParticle(grid, belowLeft.x, belowLeft.y);
            this.reactedThisFrame = true;
            return belowLeft;
          }
        }
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
    
    if (!this.reactedThisFrame) {
      if (Math.random() < 0.5) {
        if (left) {
          const leftParticle = grid.get(left.x, left.y);
          if (this.canDissolve(leftParticle)) {
            this.dissolveParticle(grid, left.x, left.y);
            this.reactedThisFrame = true;
            return left;
          }
        }
        if (right) {
          const rightParticle = grid.get(right.x, right.y);
          if (this.canDissolve(rightParticle)) {
            this.dissolveParticle(grid, right.x, right.y);
            this.reactedThisFrame = true;
            return right;
          }
        }
      } else {
        if (right) {
          const rightParticle = grid.get(right.x, right.y);
          if (this.canDissolve(rightParticle)) {
            this.dissolveParticle(grid, right.x, right.y);
            this.reactedThisFrame = true;
            return right;
          }
        }
        if (left) {
          const leftParticle = grid.get(left.x, left.y);
          if (this.canDissolve(leftParticle)) {
            this.dissolveParticle(grid, left.x, left.y);
            this.reactedThisFrame = true;
            return left;
          }
        }
      }
    }

    return { x, y };
  }
  
  canDissolve(particle) {
    if (particle.empty) return false;
    if (particle.constructor.name === 'Acid') return false;
    if (particle.constructor.name === 'Water') return false;
    if (particle.constructor.name === 'Fire') return false;
    if (particle.constructor.name === 'Smoke') return false;
    
    if (particle.constructor.name === 'Concrete') {
      return Math.random() < this.dissolveChance * 0.05;
    }
    
    const type = particle.constructor.name;
    switch (type) {
      case 'Sand':
        return Math.random() < this.dissolveChance;
      case 'Oil':
        return Math.random() < this.dissolveChance * 2;
      case 'Gunpowder':
        return Math.random() < this.dissolveChance * 1.5;
      default:
        return Math.random() < this.dissolveChance * 0.5;
    }
  }
  
  dissolveParticle(grid, x, y) {
    this.potency -= 5 + Math.random() * 15;
    
    const particle = grid.get(x, y);
    const type = particle.constructor.name;
    
    if (type === 'Concrete') {
      if (particle.damage(10 + Math.random() * 10)) {
        grid.set(x, y, new Empty());
      }
      return;
    }
    
    if (type === 'Gunpowder' && Math.random() < 0.3) {
      grid.set(x, y, ParticleFactory.createSmoke());
      return;
    }
    
    grid.set(x, y, new Empty());
  }
  
  checkForReactions(grid, x, y) {
    const positions = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
    
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height) {
        const particle = grid.get(pos.x, pos.y);
        
        if (particle.constructor.name === 'Concrete') {
          if (Math.random() < 0.1) {
            if (particle.damage(3 + Math.random() * 5)) {
              grid.set(pos.x, pos.y, new Empty());
            }
          }
          continue;
        }
        
        if (particle.constructor.name === 'Water') {
          this.potency -= 2;
          if (Math.random() < 0.1) {
            const newAcid = ParticleFactory.createAcid();
            newAcid.potency = Math.min(this.potency * 0.5, 30);
            grid.set(pos.x, pos.y, newAcid);
          }
        }
        else if (particle.constructor.name === 'Fire') {
          this.potency -= 10;
          if (Math.random() < 0.3) {
            grid.set(pos.x, pos.y, ParticleFactory.createSmoke());
          }
        }
      }
    }
  }
}