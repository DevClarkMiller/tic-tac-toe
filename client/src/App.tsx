// CSS
import './App.css';

// COMPONENT
import Grid from './component/Grid/Grid';

// CONTEXT
import { GridContextProvider } from './context/GridContext';
import GameTools from './component/GameTools/GameTools';
import Chat from '@components/Chat/Chat';
import useOptionalAuth from 'hooks/Auth/useAuth';
import Header from '@components/Header/Header';
import { createContext, useCallback, useMemo } from 'react';

export interface AppContextType {
	isLoggedIn: boolean;
	logout: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const App = () => {
	const { isLoggedIn, setIsLoggedIn } = useOptionalAuth({ optional: true });
	const logout = useCallback(() => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
	}, [setIsLoggedIn]);

	const value = useMemo((): AppContextType => {
		return { isLoggedIn, logout };
	}, [isLoggedIn, logout]);

	return (
		<AppContext.Provider value={value}>
			<GridContextProvider>
				<div className="vh-100 vw-100 d-flex align-items-center flex-column">
					<Header />
					<div
						className="w-75 d-flex flex-column flex-grow-1 justify-content-between align-items-center"
						style={{ maxWidth: '650px' }}>
						<GameTools />
						<Grid />
						<Chat />
					</div>
				</div>
			</GridContextProvider>
		</AppContext.Provider>
	);
};

export default App;
