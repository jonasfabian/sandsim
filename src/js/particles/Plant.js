import { Particle } from './Particle.js';
import { ParticleFactory } from './ParticleFactory.js';
import { Empty } from './Empty.js';

export class Plant extends Particle {
  constructor({ color, growthStage = 1, maxHeight = 5 }) {
    super({ color, empty: false });
    this.maxSpeed = 0;
    this.acceleration = 0;
    this.velocity = 0;
    this.growthStage = growthStage;
    this.maxHeight = maxHeight;
    this.growthTimer = 0;
    this.growthRate = 0.05;
    this.waterLevel = 1;
    this.spreadSeeds = false;
    this.health = 100;
    this.burning = false;
    this.color = `rgba(20, 220, 40, 0.95)`;
    console.log("PLANT CREATED!");
  }

  updateVelocity() {

    this.velocity = 0;
  }

  update() {
    super.update();

    if (this.burning) {
      this.health -= 5;
      
      const burnPercent = Math.max(0, this.health / 100);
      const r = Math.floor(255);
      const g = Math.floor(burnPercent * 100 + 50);
      const b = Math.floor(burnPercent * 30);
      this.color = `rgba(${r}, ${g}, ${b}, 0.9)`;
      
      if (this.health <= 0) {
        this.empty = true;
        return;
      }
    } else {
      this.growthTimer++;
      
      if (this.growthTimer % 15 === 0) {
        this.waterLevel += 0.1;
      }
      
      if (this.waterLevel > 0) {
        this.waterLevel -= 0.005;
        
        if (this.health < 100) {
          this.health += 0.1;
        }
      }
      this.updateColor();
    }
    
    this.modified = true;
  }
  
  updateColor() {
    if (this.burning) return;
    
    const healthPercent = this.health / 100;

    const r = Math.floor(20 + (1 - healthPercent) * 100);
    const g = Math.floor(180 + healthPercent * 70);
    const b = Math.floor(20 + (1 - healthPercent) * 20);
    
    this.color = `rgba(${r}, ${g}, ${b}, 0.95)`;
  }

  tryMove(grid, x, y) {
    this.checkInteractions(grid, x, y);
    
    if (this.burning || this.empty) {
      return { x, y };
    }
    
    if (this.waterLevel > 0.1 && Math.random() < this.growthRate) {
      this.tryGrowUpward(grid, x, y);
    }
    
    if (this.growthTimer > 50 && Math.random() < 0.01) {
      this.trySpreadSeeds(grid, x, y);
    }
    
    return { x, y };
  }
  
  tryGrowUpward(grid, x, y) {
    const above = (y > 0) ? { x, y: y - 1 } : null;
    
    if (above && grid.isEmpty(above.x, above.y)) {

      if (this.countPlantHeight(grid, x, y) < this.maxHeight) {
        console.log("PLANT GROWING UPWARD");
        const newPlant = ParticleFactory.createPlant();
        grid.set(above.x, above.y, newPlant);
      }
    }
  }
  
  countPlantHeight(grid, x, y) {
    let height = 1;
    let currentY = y;

    while (currentY < grid.height - 1) {
      currentY++;
      const below = grid.get(x, currentY);
      if (below.constructor.name !== 'Plant') {
        break;
      }
      height++;
    }
    
    currentY = y;
    while (currentY > 0) {
      currentY--;
      const above = grid.get(x, currentY);
      if (above.constructor.name !== 'Plant') {
        break;
      }
      height++;
    }
    
    return height;
  }
  
  trySpreadSeeds(grid, x, y) {
    const positions = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x: x - 2, y },
      { x: x + 2, y },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];
    
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height) {
        if (grid.isEmpty(pos.x, pos.y) && Math.random() < 0.3) {
          console.log("PLANT SPREADING SEED");
          grid.set(pos.x, pos.y, ParticleFactory.createSeed());
        }
      }
    }
  }
  
  checkInteractions(grid, x, y) {
    const positions = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y },
    ];
    
    for (const pos of positions) {
      if (pos.x >= 0 && pos.x < grid.width && pos.y >= 0 && pos.y < grid.height) {
        const particle = grid.get(pos.x, pos.y);
        
        if (particle.constructor.name === 'Water') {
          this.waterLevel += 0.2;
          
          if (Math.random() < 0.1) {
            grid.set(pos.x, pos.y, new Empty());
          }
        }
        else if (!this.burning && 
                (particle.constructor.name === 'Fire' || 
                 particle.constructor.name === 'Lava')) {
          this.burning = true;
        }
        else if (this.burning && 
                particle.constructor.name === 'Plant' && 
                Math.random() < 0.3) {
          const plant = particle;
          plant.burning = true;
        }

        else if (particle.constructor.name === 'Ice') {
          this.health -= 0.5;
        }
      }
    }
  }
  
  getUpdateCount() {
    return 1;
  }
}