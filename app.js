const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasW = 400;
let canvasH = 400;
canvas.width = canvasW;
canvas.height = canvasH;

let w = 10;
let grid = [];
let cols, rows;
let isDragging = false;
let mouseX = 0;
let mouseY = 0;

const createGrid = (cols, rows) => {
  let g = [];
  for (let i = 0; i < cols; i++) {
    g[i] = [];
    for (let j = 0; j < rows; j++) {
      g[i][j] = 0;
    }
  }
  return g;
};

const setup = () => {
  cols = Math.floor(canvasW / w);
  rows = Math.floor(canvasH / w);

  grid = createGrid(cols, rows);

  draw();
};

const draw = () => {
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvasW, canvasH);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(i * w, j * w, w - 1, w - 1);
    }
  }

  let nextGrid = createGrid(cols, rows);

  for (let j = rows - 1; j >= 0; j--) {
    for (let i = 0; i < cols; i++) {
      let state = grid[i][j];
      if (state > 0) {
        if (j + 1 < rows && grid[i][j + 1] === 0) {
          nextGrid[i][j + 1] = 1;
        } else if (j + 1 < rows && i + 1 < cols && grid[i + 1][j + 1] === 0) {
          nextGrid[i + 1][j + 1] = 1;
        } else if (j + 1 < rows && i - 1 >= 0 && grid[i - 1][j + 1] === 0) {
          nextGrid[i - 1][j + 1] = 1;
        } else {
          nextGrid[i][j] = 1;
        }
      }
    }
  }

  grid = nextGrid;
};

canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  updateMousePosition(event);
});

canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    updateMousePosition(event);
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

const updateMousePosition = (event) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
};

const updateCell = () => {
  let col = Math.floor(mouseX / w);
  let row = Math.floor(mouseY / w);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    grid[col][row] = 1;
  }
};

const animationLoop = () => {
  if (isDragging) {
    updateCell();
  }
  draw();
  setTimeout(() => {
    requestAnimationFrame(animationLoop);
  }, 40);
};

setup();
animationLoop();
