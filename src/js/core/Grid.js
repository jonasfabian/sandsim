import { Empty } from '../particles/Empty.js';

export class Grid {
    
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = [];

    for (let j = 0; j < height; j++) {
      const row = [];
      for (let i = 0; i < width; i++) {
        row.push(new Empty());
      }
      this.data.push(row);
    }
  }

  get(x, y) {
    return this.data[y][x];
  }

  set(x, y, particle) {
    this.data[y][x] = particle;
  }

  isEmpty(x, y) {
    return this.get(x, y).empty;
  }

  swap(a, b) {
    const temp = this.get(a.x, a.y);
    this.set(a.x, a.y, this.get(b.x, b.y));
    this.set(b.x, b.y, temp);
  }
}
