import { Grid } from './Grid.js';
import { Canvas } from './Canvas.js';
import { Sand } from './Sand.js';

let grid;
let canvas;
let dragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

const setup = () => {
  canvas = new Canvas("canvas", 400, 400);
  grid = new Grid(100, 100);

  canvas.canvas.addEventListener("mousedown", onMouseDown);
  canvas.canvas.addEventListener("mousemove", onMouseMove);
  canvas.canvas.addEventListener("mouseup", onMouseUp);

  requestAnimationFrame(eventLoop);
};

const drawGrid = () => {
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
};

const update = () => {
  if (dragging) {
    spawnSandAtMouse();
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
};

function stepParticle(i, j) {
  const particle = grid.get(i, j);
  particle.update();

  if (!particle.modified) {
    return;
  }

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

function updatePixel(i, j) {
  const current = grid.get(i, j);
  if (current.empty) {
    return { x: i, y: j };
  }

  const below      = j < grid.height - 1 ? { x: i,     y: j + 1 } : null;
  const belowLeft  = (i > 0 && j < grid.height - 1) ?  { x: i - 1, y: j + 1 } : null;
  const belowRight = (i < grid.width - 1 && j < grid.height - 1) ? { x: i + 1, y: j + 1 } : null;

  if (below && grid.isEmpty(below.x, below.y)) {
    grid.swap({ x: i, y: j }, below);
    return below;
  }

  if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
    grid.swap({ x: i, y: j }, belowLeft);
    return belowLeft;
  }

  if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
    grid.swap({ x: i, y: j }, belowRight);
    return belowRight;
  }

  return { x: i, y: j };
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

const onMouseDown = (event) => {
  dragging = true;
  updateMousePosition(event);
};

const onMouseMove = (event) => {
  if (dragging) {
    updateMousePosition(event);
  }
};

const onMouseUp = () => {
  dragging = false;
};

function updateMousePosition(event) {
  lastMouseX = Math.floor((event.offsetX / canvas.width) * grid.width);
  lastMouseY = Math.floor((event.offsetY / canvas.height) * grid.height);
}

function eventLoop() {
  drawGrid();
  update();
  requestAnimationFrame(eventLoop);
}

setup();
