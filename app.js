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

const setup = () => {
  cols = Math.floor(canvasW / w);
  rows = Math.floor(canvasH / w);

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }

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
};

canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
  updateCell(event);
});

canvas.addEventListener("mousemove", (event) => {
  if (isDragging) {
    updateCell(event);
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});

const updateCell = (event) => {
  let col = Math.floor(event.offsetX / w);
  let row = Math.floor(event.offsetY / w);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    if (grid[col][row] === 0) {
      grid[col][row] = 1;
      ctx.fillStyle = "black";
      ctx.fillRect(col * w, row * w, w - 1, w - 1);
    }
  }
};

const animationLoop = () => {
  draw();
  requestAnimationFrame(animationLoop);
};

setup();
animationLoop();
