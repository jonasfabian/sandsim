import { Tool } from './Tool.js';
import { ParticleFactory } from '../particles/ParticleFactory.js';

export class SeedTool extends Tool {
  constructor() {
    super();
    this.dragging = false;
    this.spawnSize = 3;
  }

  onMouseDown(grid, x, y) {
    this.dragging = true;
    this.spawnSeed(grid, x, y);
  }

  onMouseMove(grid, x, y) {
    if (this.dragging) {
      this.spawnSeed(grid, x, y);
    }
  }

  onMouseUp(grid, x, y) {
    this.dragging = false;
  }

  spawnSeed(grid, x, y) {
    const size = this.spawnSize;
    for (let i = -size; i <= size; i++) {
      for (let j = -size; j <= size; j++) {
        const tx = x + i;
        const ty = y + j;
        if (
          tx >= 0 && tx < grid.width &&
          ty >= 0 && ty < grid.height &&
          Math.random() < 0.5
        ) {
          const seed = ParticleFactory.createSeed();
          grid.set(tx, ty, seed);
        }
      }
    }
  }
}