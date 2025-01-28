export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = Array.from({ length: height }, () => Array(width).fill(0));
    }

    clear() {
        for (let y = 0; y < this.height; y++) {
            this.cells[y].fill(0);
        }
    }

    set(x, y, color) {
        this.cells[y][x] = color;
    }

    swap(a, b) {
        const temp = this.cells[a.y][a.x];
        this.cells[a.y][a.x] = this.cells[b.y][b.x];
        this.cells[b.y][b.x] = temp;
    }

    isEmpty(x, y) {
        return this.cells[y][x] === 0;
    }

    // array like behavior (forEach, map, ...)
    forEach(callback) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                callback(this.cells[y][x], x, y);
            }
        }
    }

    map(callback) {
        return this.cells.map((row, y) => row.map((cell, x) => callback(cell, x, y)));
    }

    get(x, y) {
        return this.cells[y][x];
    }
}