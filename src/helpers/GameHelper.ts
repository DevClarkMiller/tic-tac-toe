import { createGrid } from "./GridHelper";

// export const CellState = Object.freeze({
//     Empty: -1, 
//     Cross: 0, 
//     Circle: 1
// });

export enum CellState {
    Empty = -1, Cross, Circle
}

export class Coord {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Game {
    private _rows: number;
    private _cols: number;
    private _grid: CellState[][];
    private _isGameOver: boolean;
    private _activePlayer: CellState;

    public constructor(rows: number, cols: number, grid?: CellState[][]) {
        this._grid = grid != null ? this.CopyGrid(grid) : createGrid(rows, cols, -1);
        this._rows = rows;
        this._cols = cols;
        this._isGameOver = false;
        this._activePlayer = CellState.Cross;
    }

    public get Grid() { return this._grid; }

    public get Rows() { return this._rows; }
    public get Cols() { return this._cols; }

    public get IsGameOver() { return this._isGameOver; }

    public get ActivePlayer() { return this._activePlayer; }

    private CopyGrid(grid: number[][]) {
        return grid.map(row => [...row]);
    }

    public Clone() {
        return new Game(this._rows, this._cols, this._grid);
    }
    
    public MakeMove(row: number, col: number, value: CellState) {
        if (this._grid[row][col] === CellState.Empty)
            this._grid[row][col] = value;
    }

    public GetPossibleMoves() {
        const moves = new Set<Coord>(); // A set of pairs which are really just arrays with a size of two

        this._grid.forEach((cols, row) => {
            cols.forEach((state, col) => {
                if (state == CellState.Empty) moves.add(new Coord(col, row));
            });
        });

        return moves;
    }
};