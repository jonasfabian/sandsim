import { Particle } from './Particle.js';
import { ParticleFactory } from './ParticleFactory.js';

export class Concrete extends Particle {
  constructor({ color, durability = 100 }) {
    super({ color, empty: false });
    this.maxSpeed = 0;
    this.acceleration = 0;
    this.velocity = 0;
    this.durability = durability;
    this.maxDurability = durability;
    this.eroded = false;
  }

  updateVelocity() {
    this.velocity = 0;
  }

  update() {
    super.update();

    const durabilityPercent = this.durability / this.maxDurability;
    const brightness = Math.floor(180 * durabilityPercent);
    this.color = `rgba(${brightness}, ${brightness}, ${brightness}, 0.95)`;
    
    this.modified = false;
  }

  tryMove(grid, x, y) {
    return { x, y };
  }
  
  damage(amount) {
    this.durability -= amount;
    
    if (this.durability <= 0) {
      this.eroded = true;
    }
    
    return this.eroded;
  }
  
  getUpdateCount() {
    return 0;
  }

  isInContact(grid, x, y, particleType) {
    const positions = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
    
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height) {
        const particle = grid.get(pos.x, pos.y);
        if (particle && particle.constructor.name === particleType) {
          return true;
        }
      }
    }
    
    return false;
  }
}