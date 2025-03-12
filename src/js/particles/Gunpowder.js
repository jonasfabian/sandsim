import { Particle } from './Particle.js';
import { ParticleFactory } from './ParticleFactory.js';
import { Empty } from './Empty.js';

export class Gunpowder extends Particle {
  constructor({ color }) {
    super({ color, empty: false });
    this.maxSpeed = 7;
    this.acceleration = 0.15;
    this.velocity = 0;
    this.exploded = false;
    this.blastRadius = 5;
    this.blastForce = 8;
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
    this.exploded = false;
  }

  tryMove(grid, x, y) {
    if (this.empty) return { x, y };

    if (this.checkForFire(grid, x, y)) {
      this.exploded = true;
      this.explode(grid, x, y);
      return { x, y };
    }

    const below      = (y < grid.height - 1) ? { x, y: y + 1 } : null;
    const belowLeft  = (x > 0 && y < grid.height - 1) ? { x: x - 1, y: y + 1 } : null;
    const belowRight = (x < grid.width - 1 && y < grid.height - 1) ? { x: x + 1, y: y + 1 } : null;

    if (below && grid.isEmpty(below.x, below.y)) {
      return below;
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

    return { x, y };
  }
  
  checkForFire(grid, x, y) {
    const radius = 1;
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        if (i === 0 && j === 0) continue;
        
        const checkX = x + i;
        const checkY = y + j;
        
        if (checkX >= 0 && checkX < grid.width && checkY >= 0 && checkY < grid.height) {
          const particle = grid.get(checkX, checkY);
          if (particle && particle.constructor.name === 'Fire') {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  explode(grid, x, y) {
    grid.set(x, y, ParticleFactory.createFire({ lifespan: 120 }));
    
    for (let i = -this.blastRadius; i <= this.blastRadius; i++) {
      for (let j = -this.blastRadius; j <= this.blastRadius; j++) {
        const distance = Math.sqrt(i*i + j*j);
        if (distance > this.blastRadius) continue;
        
        const targetX = x + i;
        const targetY = y + j;
        
        if (targetX < 0 || targetX >= grid.width || targetY < 0 || targetY >= grid.height) {
          continue;
        }
        
        const particle = grid.get(targetX, targetY);

        if (distance < 2) {

          if (Math.random() < 0.7) {
            grid.set(targetX, targetY, ParticleFactory.createFire({ lifespan: 80 + Math.random() * 40 }));
          } else {
            grid.set(targetX, targetY, ParticleFactory.createSmoke());
          }
        } 
        else if (distance < this.blastRadius) {
          if (particle.constructor.name === 'Gunpowder' && Math.random() < 0.8) {
            if (Math.random() < 0.5) {
              particle.explode(grid, targetX, targetY);
            }
          } 
          else if (!particle.empty) {
            if (Math.random() < 0.3) {
              grid.set(targetX, targetY, ParticleFactory.createSmoke());
            }
          }
        }
      }
    }
  }
}