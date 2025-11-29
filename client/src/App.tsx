// CSS
import './App.css';

// COMPONENT
import Grid from './component/Grid/Grid';

// CONTEXT
import { GridContextProvider } from './context/GridContext';
import GameTools from './component/GameTools/GameTools';
import Chat from '@components/Chat/Chat';

const App = () => {
	return (
		<GridContextProvider>
			<div className="vh-100 vw-100 d-flex align-items-center flex-column">
				<h1>Tic-Tac-Toe</h1>
				<div
					className="w-75 d-flex flex-column flex-grow-1 justify-content-between align-items-center"
					style={{ maxWidth: '650px' }}>
					<GameTools />
					<Grid />
					<Chat />
				</div>
			</div>
		</GridContextProvider>
	);
};

export default App;
