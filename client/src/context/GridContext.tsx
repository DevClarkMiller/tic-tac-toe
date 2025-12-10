import { useMemo, createContext, type ReactNode, useEffect, useContext, useCallback } from 'react';

// HELPERS
import { CellState, cellStateName } from '@game/CellState';
import { determineMove } from '@helpers/GameTheoryHelper';
import { Game } from '@game/Game';

import { AppContext } from 'App';
import { SessionContext } from './SessionContext';

export interface GridContextType {
	onCellClick: (_row: number, _col: number) => void;
}

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const GridContextProvider = ({ children }: { children: ReactNode }) => {
	const { game, playerSymbol, setGame } = useContext(AppContext);
	const { connection, inGame, sendMove } = useContext(SessionContext);

	const onReceiveGameMove = useCallback(
		(row: number, col: number, symbol: CellState) => {
			const gameToUpdate = game.Clone();
			gameToUpdate.MakeMove({ x: col, y: row }, symbol);
			setGame(gameToUpdate);
			return gameToUpdate;
		},
		[game, setGame]
	);

	useEffect(() => {
		if (!connection) return;
		connection?.on('ReceiveGameMove', onReceiveGameMove);
	}, [connection, onReceiveGameMove]);

	const makeMove = (row: number, col: number, baseGame?: Game): Game => {
		// Always operate from a fresh clone (either passed in or current state)
		const gameToUpdate = (baseGame ?? game).Clone();
		gameToUpdate.MakeMove({ x: col, y: row });
		setGame(gameToUpdate);
		return gameToUpdate;
	};

	const onCellClick = async (row: number, col: number) => {
		if (game.IsGameOver) return;
		// Player move
		let currentGame = game.Clone();
		currentGame.GameStarted = true;

		if (inGame) {
			await sendMove(row, col);
			return;
		}

		currentGame = makeMove(row, col, currentGame);

		// AI move after the player
		const aiMove = await determineMove(currentGame);
		if (aiMove) makeMove(aiMove.y, aiMove.x, currentGame);
	};

	useEffect(() => {
		if (!game.GameStarted) game.ActivePlayer = playerSymbol;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerSymbol]);

	useEffect(() => {
		if (game?.IsGameOver) {
			const winner = game.CalculateScoreAndWinner(game.ActivePlayer).winner;
			let msg;
			if (winner !== null) msg = `${cellStateName(winner as CellState)} won the game!`;
			else msg = 'A cats game, nobody won!';

			alert(msg);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game?.IsGameOver]);

	const value = useMemo(() => {
		return { game, setGame, onCellClick };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game, onCellClick]);

	return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};
