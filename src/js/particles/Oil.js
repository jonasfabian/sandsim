import { Particle } from './Particle.js';

export class Oil extends Particle {

  constructor({ color }) {
    super({ color, empty: false });
    this.maxSpeed = 12;
    this.acceleration = 0.6;
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

    if (below) {
      const belowParticle = grid.get(below.x, below.y);
      if (grid.isEmpty(below.x, below.y)) {
        return below;
      } else if (belowParticle.constructor.name === 'Water') {
        return below;
      }
    }

    if (Math.random() < 0.5) {
      if (belowLeft) {
        const belowLeftParticle = grid.get(belowLeft.x, belowLeft.y);
        if (grid.isEmpty(belowLeft.x, belowLeft.y)) {
          return belowLeft;
        } else if (belowLeftParticle.constructor.name === 'Water') {
          return belowLeft;
        }
      }
      if (belowRight) {
        const belowRightParticle = grid.get(belowRight.x, belowRight.y);
        if (grid.isEmpty(belowRight.x, belowRight.y)) {
          return belowRight;
        } else if (belowRightParticle.constructor.name === 'Water') {
          return belowRight;
        }
      }
    } else {
      if (belowRight) {
        const belowRightParticle = grid.get(belowRight.x, belowRight.y);
        if (grid.isEmpty(belowRight.x, belowRight.y)) {
          return belowRight;
        } else if (belowRightParticle.constructor.name === 'Water') {
          return belowRight;
        }
      }
      if (belowLeft) {
        const belowLeftParticle = grid.get(belowLeft.x, belowLeft.y);
        if (grid.isEmpty(belowLeft.x, belowLeft.y)) {
          return belowLeft;
        } else if (belowLeftParticle.constructor.name === 'Water') {
          return belowLeft;
        }
      }
    }

    const left  = (x > 0)              ? { x: x - 1, y } : null;
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
}