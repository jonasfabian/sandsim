import { Particle } from './Particle.js';

export class Stone extends Particle {
  constructor({ color, type = 'normal' }) {
    super({ color, empty: false });
    this.maxSpeed = 0;
    this.acceleration = 0;
    this.velocity = 0;
    this.type = type;
  }

  updateVelocity() {
    this.velocity = 0;
  }

  update() {
    super.update();
    this.modified = false;
  }

  tryMove(grid, x, y) {
    return { x, y };
  }
  
  getUpdateCount() {
    return 0;
  }
}