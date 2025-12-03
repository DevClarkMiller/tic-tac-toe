import { useContext, useMemo } from 'react';

import PlayerSymSelector from './PlayerSymSelector';
import RefreshButton from './RefreshButton';
import DifficultySelector from './DifficultySelector';

// CONTEXT
import { GridContext } from '@context/GridContext';

const GameTools = () => {
	const { game, playerSymbol, setGame, setPlayerSymbol } = useContext(GridContext);

	const gameStarted = useMemo(() => game.GameStarted, [game]);

	return (
		<div className="row w-100 mb-2 g-2 justify-content-center">
			<div className="col-12 col-md-2 d-flex justify-content-md-center">
				<RefreshButton playerSymbol={playerSymbol} game={game} setGame={setGame} />
			</div>
			<div className="col-12 col-md-4">
				<PlayerSymSelector
					gameStarted={gameStarted}
					playerSymbol={playerSymbol}
					setPlayerSymbol={setPlayerSymbol}
				/>
			</div>
			<div className="col-12 col-md-6">
				<DifficultySelector game={game} setGame={setGame} />
			</div>
		</div>
	);
};

export default GameTools;
