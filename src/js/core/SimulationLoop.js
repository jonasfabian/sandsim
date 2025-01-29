export class SimulationLoop {
    
    constructor(updateFn, drawFn) {
      this.updateFn = updateFn;
      this.drawFn = drawFn;
      this._frameId = null;
    }
  
    start() {
      const loop = () => {
        this.updateFn();
        this.drawFn();
        this._frameId = requestAnimationFrame(loop);
      };
      this._frameId = requestAnimationFrame(loop);
    }
  
    stop() {
      if (this._frameId !== null) {
        cancelAnimationFrame(this._frameId);
        this._frameId = null;
      }
    }
  }
  