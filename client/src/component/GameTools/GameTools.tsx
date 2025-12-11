import { useContext } from 'react';

import PlayerSymSelector from './PlayerSymSelector';
import RefreshButton from './RefreshButton';
import DifficultySelector from './DifficultySelector';

// CONTEXT
import { SessionContext } from '@context/SessionContext';
import { AppContext } from 'App';

const GameTools = () => {
	const { game, playerSymbol, setGame, setPlayerSymbol } = useContext(AppContext);
	const { inGame } = useContext(SessionContext);

	return (
		<div className="row w-100 mb-2 g-2 justify-content-center">
			<div className="col-12 col-md-2 d-flex justify-content-md-center">
				<RefreshButton />
			</div>
			<div className="col-12 col-md-4">
				<PlayerSymSelector
					gameStarted={game.GameStarted}
					playerSymbol={playerSymbol}
					setPlayerSymbol={setPlayerSymbol}
				/>
			</div>
			{!inGame && (
				<div className="col-12 col-md-6">
					<DifficultySelector game={game} setGame={setGame} />
				</div>
			)}
		</div>
	);
};

export default GameTools;
