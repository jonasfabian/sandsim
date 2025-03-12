import { Sand } from './Sand.js';
import { Water } from './Water.js';
import { Oil } from './Oil.js';
import { Fire } from './Fire.js';
import { Smoke } from './Smoke.js';
import { Gunpowder } from './Gunpowder.js';
import { Acid } from './Acid.js';
import { Concrete } from './Concrete.js';
import { Lava } from './Lava.js';
import { Stone } from './Stone.js';
import { Glass } from './Glass.js';
import { Seed } from './Seed.js';
import { Plant } from './Plant.js';
import { Ice } from './Ice.js';
import { Empty } from './Empty.js';

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
  
  static createOil() {
    const alpha = 0.5 + Math.random() * 0.5;
    const color = `rgba(101, 67, 33, ${alpha})`;
    return new Oil({ color });
  }
  
  static createFire(options = {}) {
    const lifespan = options.lifespan || (50 + Math.floor(Math.random() * 100));
    const color = `rgba(255, 200, 50, 0.8)`;
    return new Fire({ color, lifespan });
  }
  
  static createSmoke() {
    const lifespan = 100 + Math.floor(Math.random() * 200);
    const color = `rgba(150, 150, 150, 0.7)`;
    return new Smoke({ color, lifespan });
  }
  
  static createGunpowder() {
    const brightness = 20 + Math.floor(Math.random() * 30);
    const color = `rgba(${brightness}, ${brightness}, ${brightness}, 0.9)`;
    return new Gunpowder({ color });
  }
  
  static createAcid() {
    const potency = 80 + Math.floor(Math.random() * 40);
    const color = `rgba(80, 255, 70, 0.8)`;
    return new Acid({ color, potency });
  }
  
  static createConcrete() {
    const durability = 800 + Math.floor(Math.random() * 400);
    const color = `rgba(180, 180, 180, 0.95)`;
    return new Concrete({ color, durability });
  }
  
  static createLava() {
    const temperature = 1000 + Math.floor(Math.random() * 400);
    const color = `rgba(255, 180, 40, 0.9)`;
    return new Lava({ color, temperature });
  }
  
  static createStone() {
    const brightness = 100 + Math.floor(Math.random() * 30);
    const color = `rgba(${brightness}, ${brightness}, ${brightness + 10}, 0.95)`;
    return new Stone({ color });
  }
  
  static createGlass() {
    const color = `rgba(200, 230, 255, 0.4)`;
    return new Glass({ color });
  }
  
  static createSeed() {
    const color = `rgba(120, 80, 40, 0.9)`;
    console.log("CREATING SEED");
    return new Seed({ color });
  }
  
  static createPlant() {
    const color = `rgba(20, 220, 40, 0.95)`;
    console.log("CREATING PLANT");
    return new Plant({ color });
  }
  
  static createIce() {
    const color = `rgba(200, 220, 255, 0.7)`;
    return new Ice({ color });
  }
  
  static createEmpty() {
    return new Empty();
  }
}