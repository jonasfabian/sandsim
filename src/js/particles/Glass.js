import { Stone } from './Stone.js';

export class Glass extends Stone {
  constructor({ color }) {
    super({ color, type: 'glass' });
    this.maxSpeed = 0;
    this.acceleration = 0;
    this.velocity = 0;
  }
}