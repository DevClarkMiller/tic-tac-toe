import { createGrid } from "./GridHelper";

interface IMemento {
    Serialize(): unknown;
}

export enum CellState {
    Empty = -1, Cross, Circle
}

export const cellStateName = (val: CellState) => {
    switch (val) {
        case CellState.Empty: return 'Empty';
        case CellState.Circle: return 'Circle';
        case CellState.Cross: return 'Cross';
    }
}

export const isPlayer = (val: CellState) => {
    return val != CellState.Empty;
}

export class Coord {
    public x: number;
    public y: number;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export const getOppositePlayer = (player: CellState) => {
    if (player == CellState.Cross) return CellState.Circle;
    return CellState.Cross;
};

// const DIRS = [[-1, 0], [1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
const DIRS_WITH_COMPLIMENTS = [
    [[1, 0], [-1, 0]],
    [[0, 1], [0, -1]],
    [[1, 1], [-1, -1]],
    [[-1, 1], [1, -1]]
];

export class Game {
    private _rows: number;
    private _cols: number;
    private _grid: CellState[][];
    private _isGameOver: boolean;
    private _activePlayer: CellState;
    private _gameStarted: boolean;

    private _scores: Map<CellState, number>;

    public constructor(rows: number, cols: number, grid?: CellState[][]) {
        this._grid = grid != null ? this.CopyGrid(grid) : createGrid(rows, cols, -1);
        this._rows = rows;
        this._cols = cols;
        this._isGameOver = false;
        this._activePlayer = CellState.Cross;
        this._scores = new Map<CellState, number>();
        this._gameStarted = false;
    }

    public get Grid() { return this._grid; }

    public get Rows() { return this._rows; }
    public get Cols() { return this._cols; }

    public get IsGameOver() { return this._isGameOver; }
    public set IsGameOver(val: boolean) { this._isGameOver = val; }

    public get ActivePlayer() { return this._activePlayer; }
    public set ActivePlayer(val: CellState) { this._activePlayer = val; }

    public get GameStarted() { return this._gameStarted; }
    public set GameStarted(val: boolean) { this._gameStarted = val; }

    private InitScore(player: CellState) {
        if (!this._scores.has(player)) this._scores.set(player, 0);
    }

    public GetScore(player: CellState): number {
        this.InitScore(player);
        return this._scores.get(player) as number;
    }

    public SetScore(player: CellState, value: number) {
        this._scores.set(player, value);
    }

    private CopyGrid(grid: number[][]) {
        return grid.map(row => [...row]);
    }

    public Clone() {
        const newGame = new Game(this._rows, this._cols, this._grid);
        newGame.ActivePlayer = this._activePlayer;
        newGame.IsGameOver = this._isGameOver;
        return newGame;
    }

    private NumAlignedCells = (x: number, y: number, xMod: number, yMod: number, cell: CellState) => {
        const ROWS = 3;
        const COLS = 3;
        const RANGE = 2;

        let matchCnt = 0;

        x += xMod;
        y += yMod;
        
        for (let i = 0; i < RANGE; i++) {
            // stop if out of bounds
            if (x < 0 || x >= COLS || y < 0 || y >= ROWS) break;

            // count if matching, else stop
            if (this._grid[y][x] === cell) matchCnt++;
            else break;

            // move again in the same direction
            x += xMod;
            y += yMod;
        }

        return matchCnt;
    }

    // TODO: MAKE MORE EFFICIENT
    private CheckCellWin(x: number, y: number) {
        const NUM_ALIGNED_TO_WIN = 3;

        const cell = this._grid[y][x];
        if (cell === CellState.Empty) return false;
        // CHECK EACH DIRECTION BY THE GIVEN RANGE
        for (const dirWithCompliment of DIRS_WITH_COMPLIMENTS) {
            let alignedCnt = 1;
            for (const dir of dirWithCompliment) {
                alignedCnt += this.NumAlignedCells(x, y, dir[0], dir[1], cell);
            }

            if (alignedCnt >= NUM_ALIGNED_TO_WIN)return true; 
        }

        return false;
    }

    public AddToScore(player: CellState, score: number) {
        this.InitScore(player);
        const currScore = this._scores.get(player); 
        this._scores.set(player, (currScore as number) + score);
    }

    private CheckForEnd() {
        // Check each direction for a win, if win game over
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                if (this.CheckCellWin(col, row)) return true;
            }
        }

        // If the number of possible moves is 0 and there's no winner, game over
        return this.GetPossibleMoves().size == 0;
    }
    
    public MakeMove(coord: Coord) {
        const row = coord.y;
        const col = coord.x;
        if (this._grid[row][col] === CellState.Empty)
            this._grid[row][col] = this._activePlayer;

        if (this.CheckForEnd()) this._isGameOver = true;
        
        this._activePlayer = getOppositePlayer(this._activePlayer);
    }

    public GetPossibleMoves() {
        const moves = new Set<Coord>();

        for (let r = 0; r < this.Rows; r++) {
            for (let c = 0; c < this.Cols; c++) {
                if (this._grid[r][c] == CellState.Empty) moves.add(new Coord(c, r));
            }
        }

        return moves;
    }

    public CalculateScoreAndWinner(maximizingSym: CellState) {
        let score = 0;
        let winner: CellState | null = null;

        // Loop through each cell
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                const cell = this._grid[row][col];
                if (cell === CellState.Empty) continue;

                // Check all directions (horizontal, vertical, diagonals)
                for (const dirWithCompliment of DIRS_WITH_COMPLIMENTS) {
                    let alignedCnt = 1;
                    for (const dir of dirWithCompliment) {
                        alignedCnt += this.NumAlignedCells(col, row, dir[0], dir[1], cell);
                    }

                    if (alignedCnt >= 3) {
                        // Terminal win/loss
                        score += cell === maximizingSym ? 10 : -10;
                        winner = cell;
                    } else if (alignedCnt === 2) {
                        // Potential threats / two-in-a-row
                        score += cell === maximizingSym ? 2 : -2;
                    }
                }
            }
        }

        return { score, winner };
    }

    static Memento = class implements IMemento {
        public Rows: number;
        public Cols: number;
        public Grid: CellState[][];
        public IsGameOver: boolean;
        public ActivePlayer: CellState;
        public Scores: Map<CellState, number>;

        public constructor(rows: number, cols: number, grid: CellState[][], isGameOver: boolean, activePlayer: CellState, scores: Map<CellState, number>) {
            this.Rows = rows;
            this.Cols = cols;
            this.Grid = grid;
            this.IsGameOver = isGameOver;
            this.ActivePlayer = activePlayer;
            this.Scores = scores;
        }

        public Serialize(): unknown {
            return {
                rows: this.Rows,
                cols: this.Cols,
                grid: this.Grid,
                isGameOver: this.IsGameOver,
                activePlayer: this.ActivePlayer
            };
        }
    }

    public GetState(): IMemento {
        const gridCpy = this._grid.map(row => [...row]);
        const scoresCpy = new Map(this._scores); // <-- clone Map

        const memento = new Game.Memento(this._rows, this._cols, gridCpy, this._isGameOver, this._activePlayer, scoresCpy);
        return memento;
    }

    public SetState(memento: IMemento) {
        if (!(memento instanceof Game.Memento)) return;
        this._rows = memento.Rows;
        this._cols = memento.Cols;
        this._grid = memento.Grid;
        this._isGameOver = memento.IsGameOver;
        this._activePlayer = memento.ActivePlayer;
        this._scores = memento.Scores;
    }
};