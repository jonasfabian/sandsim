import { Grid } from './Grid.js';
import { Canvas } from './Canvas.js';
import { SimulationLoop } from './SimulationLoop.js';

import { SandTool } from '../tools/SandTool.js';
import { WaterTool } from '../tools/WaterTool.js';

let grid;
let canvas;

const leftTool = new SandTool();
const rightTool = new WaterTool();

let lastMouseX = 0;
let lastMouseY = 0;

window.addEventListener("DOMContentLoaded", () => {
  canvas = new Canvas("canvas", 400, 400);
  grid = new Grid(100, 100);

  canvas.canvas.addEventListener("mousedown", onMouseDown);
  canvas.canvas.addEventListener("mousemove", onMouseMove);
  canvas.canvas.addEventListener("mouseup", onMouseUp);
  canvas.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

  const loop = new SimulationLoop(update, draw);
  loop.start();
});

function onMouseDown(e) {
  updateMousePosition(e);
  if (e.button === 0) {
    leftTool.onMouseDown(grid, lastMouseX, lastMouseY);
  } else if (e.button === 2) {
    rightTool.onMouseDown(grid, lastMouseX, lastMouseY);
  }
}

function onMouseMove(e) {
  updateMousePosition(e);
  if (e.buttons === 1) {
    leftTool.onMouseMove(grid, lastMouseX, lastMouseY);
  } else if (e.buttons === 2) {
    rightTool.onMouseMove(grid, lastMouseX, lastMouseY);
  }
}

function onMouseUp(e) {
  updateMousePosition(e);
  if (e.button === 0) {
    leftTool.onMouseUp(grid, lastMouseX, lastMouseY);
  } else if (e.button === 2) {
    rightTool.onMouseUp(grid, lastMouseX, lastMouseY);
  }
}

function updateMousePosition(e) {
  const rect = canvas.canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  lastMouseX = Math.floor((mouseX / canvas.width) * grid.width);
  lastMouseY = Math.floor((mouseY / canvas.height) * grid.height);
}

function update() {
  for (let j = grid.height - 1; j >= 0; j--) {
    const leftToRight = Math.random() > 0.5;
    if (leftToRight) {
      for (let i = 0; i < grid.width; i++) {
        stepParticle(i, j);
      }
    } else {
      for (let i = grid.width - 1; i >= 0; i--) {
        stepParticle(i, j);
      }
    }
  }
}

function stepParticle(i, j) {
  const particle = grid.get(i, j);
  particle.update();

  if (!particle.modified) return;

  const steps = particle.getUpdateCount();

  for (let count = 0; count < steps; count++) {
    const { x: newX, y: newY } = particle.tryMove(grid, i, j);
    if (newX === i && newY === j) {
      particle.resetVelocity();
      break;
    } else {
      grid.swap({ x: i, y: j }, { x: newX, y: newY });
      i = newX;
      j = newY;
    }
  }
}

function draw() {
  const cellW = canvas.width / grid.width;
  const cellH = canvas.height / grid.height;

  canvas.clear();

  for (let i = 0; i < grid.width; i++) {
    for (let j = 0; j < grid.height; j++) {
      const cell = grid.get(i, j);
      if (!cell.empty) {
        canvas.drawRect(
          i * cellW,
          j * cellH,
          cellW,
          cellH,
          cell.color
        );
      }
    }
  }
}
