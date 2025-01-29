import { Particle } from './Particle.js';

export class Empty extends Particle {
  static baseColor = "white";

  constructor() {
    super({ empty: true });
    this.color = Empty.baseColor;
  }
}
