import { Tool } from './Tool.js';
import { ParticleFactory } from '../particles/ParticleFactory.js';

export class SandTool extends Tool {

  constructor() {
    super();
    this.dragging = false;
  }

  onMouseDown(grid, x, y) {
    this.dragging = true;
    this.spawnSand(grid, x, y);
  }

  onMouseMove(grid, x, y) {
    if (this.dragging) {
      this.spawnSand(grid, x, y);
    }
  }

  onMouseUp(grid, x, y) {
    this.dragging = false;
  }

  spawnSand(grid, x, y) {
    const positions = [
      { x, y },
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y - 1 }
    ];

    positions.forEach(pos => {
      if (
        pos.x >= 0 && pos.x < grid.width &&
        pos.y >= 0 && pos.y < grid.height
      ) {
        if (Math.random() < 0.5) {
          grid.set(pos.x, pos.y, ParticleFactory.createSand());
        }
      }
    });
  }
}
