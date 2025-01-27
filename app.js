const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasW = 400;
let canvasH = 400;
canvas.width = canvasW;
canvas.height = canvasH;

let w = 10;
let grid = [];
let cols, rows;

const setup = () => {
  cols = Math.floor(canvasW / w);
  rows = Math.floor(canvasH / w);

  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
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

setup();
draw();
