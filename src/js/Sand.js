import { Particle } from "./Particle.js";

export class Sand extends Particle {
  constructor({ color }) {
    super({ color, empty: false });
    this.maxSpeed = 8;
    this.acceleration = 0.1;
    this.velocity = 0;
    this.modified = false;
  }

  updateVelocity() {
    let newVelocity = this.velocity + this.acceleration;
    if (Math.abs(newVelocity) > this.maxSpeed) {
      newVelocity = Math.sign(newVelocity) * this.maxSpeed;
    }
    this.velocity = newVelocity;
  }

  resetVelocity() {
    this.velocity = 0;
  }

  getUpdateCount() {
    const absVelocity = Math.abs(this.velocity);
    const floored = Math.floor(absVelocity);
    const fraction = absVelocity - floored;
    return floored + (Math.random() < fraction ? 1 : 0);
  }

  update() {
    if ((this.maxSpeed ?? 0) === 0) {
      this.modified = false;
      return;
    }
    this.updateVelocity();
    this.modified = (this.velocity !== 0);
  }
}
