import { Particle } from './Particle.js';

export class Sand extends Particle {

  constructor({ color }) {
    super({ color, empty: false });
    this.maxSpeed = 8;
    this.acceleration = 0.1;
    this.velocity = 0;
  }

  updateVelocity() {
    let newVelocity = this.velocity + this.acceleration;
    if (Math.abs(newVelocity) > this.maxSpeed) {
      newVelocity = Math.sign(newVelocity) * this.maxSpeed;
    }
    this.velocity = newVelocity;
  }

  tryMove(grid, x, y) {
    if (this.empty) return { x, y };

    const below      = (y < grid.height - 1) ? { x, y: y + 1 } : null;
    const belowLeft  = (x > 0 && y < grid.height - 1) ? { x: x - 1, y: y + 1 } : null;
    const belowRight = (x < grid.width - 1 && y < grid.height - 1) ? { x: x + 1, y: y + 1 } : null;

    if (below && grid.get(below.x, below.y)?.constructor?.name === 'Water') {
      return below;
    }

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
}
