import { Tool } from './Tool.js';
import { ParticleFactory } from '../particles/ParticleFactory.js';

export class WaterTool extends Tool {

  constructor() {
    super();
    this.dragging = false;
  }

  onMouseDown(grid, x, y) {
    this.dragging = true;
    this.spawnWater(grid, x, y);
  }

  onMouseMove(grid, x, y) {
    if (this.dragging) {
      this.spawnWater(grid, x, y);
    }
  }

  onMouseUp(grid, x, y) {
    this.dragging = false;
  }

  spawnWater(grid, x, y) {
    const positions = [
      { x, y },
      { x: x - 1, y },
      { x: x + 1, y }
    ];

    positions.forEach(pos => {
      if (
        pos.x >= 0 && pos.x < grid.width &&
        pos.y >= 0 && pos.y < grid.height
      ) {
        if (Math.random() < 0.5) {
          grid.set(pos.x, pos.y, ParticleFactory.createWater());
        }
      }
    });
  }
}
