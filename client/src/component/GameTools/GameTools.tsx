import { useContext, useMemo } from 'react';

import PlayerSymSelector from './PlayerSymSelector';
import RefreshButton from './RefreshButton';
import DifficultySelector from './DifficultySelector';

// CONTEXT
import { GridContext } from '@context/GridContext';

const GameTools = () => {
	const { game, playerSymbol, setGame, setPlayerSymbol } =
		useContext(GridContext);

	const gameStarted = useMemo(() => game.GameStarted, [game]);

	return (
		<div className="d-flex mb-2 justify-content-between align-items-start flex-column gap-2 flex-lg-row align-items-lg-center">
			<PlayerSymSelector
				gameStarted={gameStarted}
				playerSymbol={playerSymbol}
				setPlayerSymbol={setPlayerSymbol}
			/>
			<DifficultySelector game={game} setGame={setGame} />
			<RefreshButton playerSymbol={playerSymbol} game={game} setGame={setGame} />
		</div>
	);
};

export default GameTools;
