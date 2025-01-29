import { Sand } from './Sand.js';
import { Water } from './Water.js';

export class ParticleFactory {
  static createSand() {
    const alpha = 0.5 + Math.random() * 0.5;
    const color = `rgba(194, 178, 128, ${alpha})`;
    return new Sand({ color });
  }

  static createWater() {
    const alpha = 0.5 + Math.random() * 0.5;
    const color = `rgba(64, 164, 223, ${alpha})`;
    return new Water({ color });
  }
}
