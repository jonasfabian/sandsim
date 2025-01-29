import { Particle } from "./Particle.js";

export class Sand extends Particle {
  constructor({ color }) {
    super({ color, empty: false });
  }
}
