import { Grid } from './Grid.js';
import { Canvas } from './Canvas.js';

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
      if (cell !== 0) {
        canvas.drawRect(i * cellWidth, j * cellHeight, cellWidth, cellHeight, "blue");
      }
    }
  }
};

const update = () => {
  
  if (dragging) {
    grid.set(lastMouseX, lastMouseY, 1);
    grid.set(lastMouseX - 1, lastMouseY, 1);
    grid.set(lastMouseX + 1, lastMouseY, 1);
    grid.set(lastMouseX, lastMouseY + 1, 1);
    grid.set(lastMouseX, lastMouseY - 1, 1);
  }

  for (let i = 0; i < grid.width; i++) {
    for (let j = grid.height - 1; j >= 0; j--) {
      const current = grid.get(i, j);

      if (current > 0) {
        const below      = j < grid.height - 1 ? { x: i, y: j + 1 } : null;
        const belowLeft  = (i > 0 && j < grid.height - 1) ? { x: i - 1, y: j + 1 } : null;
        const belowRight = (i < grid.width - 1 && j < grid.height - 1) ? { x: i + 1, y: j + 1 } : null;

        if (below && grid.isEmpty(below.x, below.y)) {
          grid.swap({ x: i, y: j }, below);
        } else if (belowLeft && grid.isEmpty(belowLeft.x, belowLeft.y)) {
          grid.swap({ x: i, y: j }, belowLeft);
        } else if (belowRight && grid.isEmpty(belowRight.x, belowRight.y)) {
          grid.swap({ x: i, y: j }, belowRight);
        }
      }
    }
  }
};

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

const eventLoop = () => {
  drawGrid();
  update();
  requestAnimationFrame(eventLoop);
};

setup();
