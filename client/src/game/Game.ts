import { DIRS_WITH_COMPLIMENTS, getOppositePlayer } from '@helpers/GameHelper';
import { createGrid } from '@helpers/GridHelper';
import { Coord } from '@models/Coord';
import type { IMemento } from '@models/IMemento';
import { CellState } from '@game/CellState';
import { Difficulty } from './Difficulty';
import { shuffle } from '@helpers/ArrayHelper';

export class Game {
	private _rows: number = 0;
	private _cols: number = 0;
	private _grid: CellState[][] = [];
	private _isGameOver: boolean = false;
	private _activePlayer: CellState = CellState.Cross;
	private _gameStarted: boolean = false;
	private _difficulty: number = Difficulty.Hard;
	private _winner: CellState | null = null;

	private _scores: Map<CellState, number> = new Map<CellState, number>();

	public constructor(rows: number, cols: number, grid?: CellState[][], memento?: IMemento) {
		if (memento != null && memento instanceof Game.Memento) {
			this.SetState(memento);
			return;
		}

		this._grid = grid != null ? this.CopyGrid(grid) : createGrid(rows, cols, -1);
		this._rows = rows;
		this._cols = cols;
	}

	public get Grid() {
		return this._grid;
	}

	public get Rows() {
		return this._rows;
	}
	public get Cols() {
		return this._cols;
	}

	public get IsGameOver() {
		return this._isGameOver;
	}
	public set IsGameOver(val: boolean) {
		this._isGameOver = val;
	}

	public get ActivePlayer() {
		return this._activePlayer;
	}

	public set ActivePlayer(val: CellState) {
		this._activePlayer = val;
	}

	public get GameStarted() {
		return this._gameStarted;
	}
	public set GameStarted(val: boolean) {
		this._gameStarted = val;
	}

	public get Difficulty() {
		return this._difficulty;
	}
	public set Difficulty(val: number) {
		this._difficulty = val;
	}

	public get Winner(): CellState | null {
		return this._winner;
	}

	public set Winner(val: CellState) {
		this._winner = val;
	}

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

	public GetResetGame(playerSymbol: CellState): Game {
		const newGame = new Game(this._rows, this._cols);
		newGame.ActivePlayer = playerSymbol;
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
	};

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

			if (alignedCnt >= NUM_ALIGNED_TO_WIN) return true;
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
		return this.GetPossibleMoves().length == 0;
	}

	public MakeMove(coord: Coord, symbol: CellState | null = null) {
		const row = coord.y;
		const col = coord.x;

		const symToUse = symbol ? symbol : this._activePlayer;

		if (this._grid[row][col] === CellState.Empty) this._grid[row][col] = symToUse;

		if (this.CheckForEnd()) this._isGameOver = true;

		this._activePlayer = getOppositePlayer(symToUse);
	}

	public GetPossibleMoves() {
		const moves: Coord[] = [];

		for (let r = 0; r < this.Rows; r++) {
			for (let c = 0; c < this.Cols; c++) {
				if (this._grid[r][c] == CellState.Empty) moves.push(new Coord(c, r));
			}
		}

		return shuffle(moves);
	}

	public CalculateScoreAndWinner(maximizingSym: CellState) {
		let score = 0;
		let winner: CellState | null = null;

		let weights = { win: 10, two: 2, noise: 0 };
		switch (this._difficulty) {
			case Difficulty.Medium:
				weights = { win: 8, two: 1.5, noise: 1.5 };
				break;
			case Difficulty.Easy:
				weights = { win: 6, two: 1, noise: 3 };
				break;
		}

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
						score += cell === maximizingSym ? weights.win : -weights.win;
						winner = cell;
					} else if (alignedCnt === 2) {
						// Potential threats / two-in-a-row
						score += cell === maximizingSym ? weights.two : -weights.two;
					}
				}
			}
		}

		if (this._difficulty != Difficulty.Hard) {
			const noise = (Math.random() - 0.5) * weights.noise;
			score += noise;
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
		public GameStarted: boolean;

		public constructor(
			rows: number,
			cols: number,
			grid: CellState[][],
			isGameOver: boolean,
			activePlayer: CellState,
			scores: Map<CellState, number>,
			gameStarted: boolean
		) {
			this.Rows = rows;
			this.Cols = cols;
			this.Grid = grid;
			this.IsGameOver = isGameOver;
			this.ActivePlayer = activePlayer;
			this.Scores = scores;
			this.GameStarted = gameStarted;
		}

		public Serialize(): unknown {
			return {
				rows: this.Rows,
				cols: this.Cols,
				grid: this.Grid,
				isGameOver: this.IsGameOver,
				activePlayer: this.ActivePlayer,
			};
		}
	};

	public GetState(): IMemento {
		const gridCpy = this._grid.map(row => [...row]);
		const scoresCpy = new Map(this._scores); // Clone Map

		const memento = new Game.Memento(
			this._rows,
			this._cols,
			gridCpy,
			this._isGameOver,
			this._activePlayer,
			scoresCpy,
			this.GameStarted
		);
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
		this._gameStarted = memento.GameStarted;
	}

	public Clone() {
		const memento = this.GetState();
		return new Game(0, 0, undefined, memento);
	}
}
