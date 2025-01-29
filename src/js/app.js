import { Grid } from './Grid.js';
import { Canvas } from './Canvas.js';
import { Sand } from './Sand.js';
import { Water } from "./Water.js";

let grid;
let canvas;
let leftDragging = false;
let rightDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function setup() {
  canvas = new Canvas("canvas", 400, 400);
  grid = new Grid(100, 100);

  canvas.canvas.addEventListener("mousedown", onMouseDown);
  canvas.canvas.addEventListener("mousemove", onMouseMove);
  canvas.canvas.addEventListener("mouseup", onMouseUp);

  canvas.canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  requestAnimationFrame(eventLoop);
}

function onMouseDown(event) {
  updateMousePosition(event);
  if (event.button === 0) {
    leftDragging = true;
  } else if (event.button === 2) {
    rightDragging = true;
  }
}

function onMouseMove(event) {
  updateMousePosition(event);
}

function onMouseUp(event) {
  if (event.button === 0) {
    leftDragging = false;
  } else if (event.button === 2) {
    rightDragging = false;
  }
}

function updateMousePosition(event) {
  lastMouseX = Math.floor((event.offsetX / canvas.width) * grid.width);
  lastMouseY = Math.floor((event.offsetY / canvas.height) * grid.height);
}

function eventLoop() {
  drawGrid();
  update();
  requestAnimationFrame(eventLoop);
}

function drawGrid() {
  const cellWidth = canvas.width / grid.width;
  const cellHeight = canvas.height / grid.height;

  canvas.clear();
  
  for (let i = 0; i < grid.width; i++) {
    for (let j = 0; j < grid.height; j++) {
      const cell = grid.get(i, j);
      if (!cell.empty) {
        canvas.drawRect(
          i * cellWidth,
          j * cellHeight,
          cellWidth,
          cellHeight,
          cell.color
        );
      }
    }
  }
}

function update() {

  if (leftDragging) {
    spawnSandAtMouse();
  }

  if (rightDragging) {
    spawnWaterAtMouse();
  }

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
    const { x: newX, y: newY } = updatePixel(i, j);
    if (newX === i && newY === j) {
      particle.resetVelocity();
      break;
    } else {
      i = newX;
      j = newY;
    }
  }
}

function spawnSandAtMouse() {
  const positions = [
    { x: lastMouseX,     y: lastMouseY },
    { x: lastMouseX - 1, y: lastMouseY },
    { x: lastMouseX + 1, y: lastMouseY },
    { x: lastMouseX,     y: lastMouseY - 1 },
    { x: lastMouseX,     y: lastMouseY + 1 },
    { x: lastMouseX + 1, y: lastMouseY + 1 },
    { x: lastMouseX - 1, y: lastMouseY + 1 },
    { x: lastMouseX + 1, y: lastMouseY - 1 },
    { x: lastMouseX - 1, y: lastMouseY - 1 }
  ];

  positions.forEach(({ x, y }) => {
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
      return;
    }
    if (Math.random() < 0.5) {
      let alpha = 0.5 + Math.random() * 0.5;
      const color = `rgba(194, 178, 128, ${alpha})`;
      grid.set(x, y, new Sand({ color }));
    }
  });
}

function spawnWaterAtMouse() {
  const positions = [
    { x: lastMouseX,     y: lastMouseY },
    { x: lastMouseX - 1, y: lastMouseY },
    { x: lastMouseX + 1, y: lastMouseY }
  ];

  positions.forEach(({ x, y }) => {
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
      return;
    }
    if (Math.random() < 0.5) {
      let alpha = 0.5 + Math.random() * 0.5;
      const color = `rgba(64, 164, 223, ${alpha})`;
      grid.set(x, y, new Water({ color }));
    }
  });
}

function updatePixel(i, j) {
  const current = grid.get(i, j);
  if (current.empty) {
    return { x: i, y: j };
  }

  const isSand  = current instanceof Sand;
  const isWater = current instanceof Water;

  const below      = (j < grid.height - 1) ? { x: i,     y: j + 1 } : null;
  const belowLeft  = (i > 0 && j < grid.height - 1) ? { x: i - 1, y: j + 1 } : null;
  const belowRight = (i < grid.width - 1 && j < grid.height - 1) ? { x: i + 1, y: j + 1 } : null;

  if (isSand) {
    if (below && grid.get(below.x, below.y) instanceof Water) {
      grid.swap({ x: i, y: j }, below);
      return below;
    }
  }

  if (below && grid.isEmpty(below.x, below.y)) {
    grid.swap({ x: i, y: j }, below);
    return below;
  }

  if (Math.random() < 0.5) {
    if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
      grid.swap({ x: i, y: j }, belowLeft);
      return belowLeft;
    }
    if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
      grid.swap({ x: i, y: j }, belowRight);
      return belowRight;
    }
  } else {
    if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
      grid.swap({ x: i, y: j }, belowRight);
      return belowRight;
    }
    if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
      grid.swap({ x: i, y: j }, belowLeft);
      return belowLeft;
    }
  }

  if (isWater) {
    const left  = (i > 0)               ? { x: i - 1, y: j } : null;
    const right = (i < grid.width - 1)  ? { x: i + 1, y: j } : null;

    if (Math.random() < 0.5) {
      if (left && grid.isEmpty(left.x, left.y)) {
        grid.swap({ x: i, y: j }, left);
        return left;
      }
      if (right && grid.isEmpty(right.x, right.y)) {
        grid.swap({ x: i, y: j }, right);
        return right;
      }
    } else {
      if (right && grid.isEmpty(right.x, right.y)) {
        grid.swap({ x: i, y: j }, right);
        return right;
      }
      if (left && grid.isEmpty(left.x, left.y)) {
        grid.swap({ x: i, y: j }, left);
        return left;
      }
    }
  }

  return { x: i, y: j };
}

window.addEventListener("DOMContentLoaded", setup);
