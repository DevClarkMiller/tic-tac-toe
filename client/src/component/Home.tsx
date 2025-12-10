import { useContext } from 'react';
import { AppContext } from 'App';
import Grid from './Grid/Grid';
import SessionManager from './SessionManager/SessionManager';
import GameTools from './GameTools/GameTools';
import Chat from './Chat/Chat';
import { SessionContext } from '@context/SessionContext';

const Home = () => {
	const { isLoggedIn, user } = useContext(AppContext);
	const { inGame } = useContext(SessionContext);

	const gridMdSize = inGame ? 'col-md-8' : '';
	const justifyContent = inGame ? 'justify-content-between' : 'justify-content-center';

	return (
		<div className="h-100 w-100 d-flex flex-column flex-grow-1 justify-content-between align-items-center gap-2">
			<div
				className="w-75 d-flex flex-column flex-grow-1 justify-content-between align-items-center gap-2"
				style={{ maxWidth: '650px' }}>
				<GameTools />
				{isLoggedIn && user && <SessionManager />}
			</div>
			<div className={`row w-75 h-100 ${justifyContent}`}>
				<div className={`col-12 ${gridMdSize} p-0 m-0 w-max-md-650px`}>
					<Grid />
				</div>
				{inGame && (
					<div className="col-12 col-md-4 p-0 m-0">
						<Chat />
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
