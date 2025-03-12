import { Particle } from './Particle.js';
import { ParticleFactory } from './ParticleFactory.js';
import { Empty } from './Empty.js';

export class Seed extends Particle {
  constructor({ color }) {
    super({ color, empty: false });
    this.maxSpeed = 8;
    this.acceleration = 0.1;
    this.velocity = 0;
    this.planted = false;
    this.growthStage = 0;
    this.maxGrowthStage = 3;
    this.growthTimer = 0;
    this.growthRate = 0.2;
    this.waterLevel = 0;
    this.checkTimer = 0;
    this.readyToTransform = false;
  }

  updateVelocity() {
    if (!this.planted) {
      let newVelocity = this.velocity + this.acceleration;
      if (Math.abs(newVelocity) > this.maxSpeed) {
        newVelocity = Math.sign(newVelocity) * this.maxSpeed;
      }
      this.velocity = newVelocity;
    } else {
      this.velocity = 0;
    }
  }

  update() {
    super.update();
    
    if (!this.planted) {
      this.checkTimer++;
      if (this.checkTimer > 5) {
        this.planted = true;
        this.color = `rgba(120, 100, 40, 0.9)`;
      }
    }
    
    if (this.planted) {
      this.growthTimer++;
      
      if (this.growthTimer % 2 === 0) {
        this.waterLevel += 0.2;
      }
      

      if (this.growthTimer % 5 === 0) {
        this.tryGrow();
      }

      this.updateColor();
    

      if (this.growthStage >= this.maxGrowthStage) {
        this.readyToTransform = true;
        this.color = `rgba(20, 200, 20, 0.9)`;
      }
    }
    
    this.modified = true;
  }
  
  updateColor() {
    const growthPercent = this.growthStage / this.maxGrowthStage;
    
    const r = Math.floor(120 - growthPercent * 100);
    const g = Math.floor(80 + growthPercent * 120);
    const b = Math.floor(40 - growthPercent * 20);
    
    this.color = `rgba(${r}, ${g}, ${b}, 0.9)`;
  }
  
  tryGrow() {
    if (this.planted && this.growthStage < this.maxGrowthStage) {
      const growthChance = 0.5 + (this.waterLevel * 0.3);
      
      if (Math.random() < growthChance) {
        this.growthStage++;
        console.log("Seed grew to stage:", this.growthStage);
        
        if (this.growthStage >= this.maxGrowthStage) {
          console.log("SEED READY TO TRANSFORM TO PLANT!");
          this.readyToTransform = true;
        }
      }
    }
    return this.readyToTransform;
  }

  tryMove(grid, x, y) {
    if (this.empty) return { x, y };

    if (this.readyToTransform) {
      grid.set(x, y, ParticleFactory.createPlant());
      console.log("DIRECT PLANT REPLACEMENT!");
      return { x, y };
    }

    if (this.planted) {
      this.checkForWater(grid, x, y);
      return { x, y };
    }
    
    const below = (y < grid.height - 1) ? { x, y: y + 1 } : null;
    if (below && grid.isEmpty(below.x, below.y)) {
      this.checkTimer = 0;
      return below;
    }
    
    const belowLeft = (x > 0 && y < grid.height - 1) ? { x: x - 1, y: y + 1 } : null;
    const belowRight = (x < grid.width - 1 && y < grid.height - 1) ? { x: x + 1, y: y + 1 } : null;
    
    if (Math.random() < 0.5) {
      if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
        this.checkTimer = 0;
        return belowLeft;
      }
      if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
        this.checkTimer = 0;
        return belowRight;
      }
    } else {
      if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
        this.checkTimer = 0;
        return belowRight;
      }
      if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
        this.checkTimer = 0;
        return belowLeft;
      }
    }
    
    return { x, y };
  }
  
  checkForWater(grid, x, y) {
    const positions = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
      { x: x + 1, y: y + 1 }, 
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y - 1 },
    ];
    
    let foundWater = false;
    
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height) {
        const particle = grid.get(pos.x, pos.y);
        
        if (particle.constructor.name === 'Water') {
          this.waterLevel += 0.8;
          foundWater = true;
          
          if (Math.random() < 0.1) {
            grid.set(pos.x, pos.y, new Empty());
          }
        }
      }
    }
    
    return foundWater;
  }
  
  getUpdateCount() {
    return 1;
  }
}