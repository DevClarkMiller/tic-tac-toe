import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUser, IDENTITY_API_URL, IDENTITY_URL } from 'services/Identity';
import { useAuth, type User } from 'helios-identity-sdk';
import { CellState } from '@game/CellState';

// CSS
import './App.css';

// COMPONENT
import { BallTriangle } from 'react-loading-icons';
import Home from '@components/Home';
import Header from '@components/Header/Header';

// CONTEXT
import { GridContextProvider } from './context/GridContext';
import SessionContextProvider from '@context/SessionContext';
import { Game } from '@game/Game';

export interface AppContextType {
	isLoggedIn: boolean;
	playerSymbol: CellState;
	user: User | null;
	game: Game;
	setGame: React.Dispatch<React.SetStateAction<Game>>;
	logout: () => void;
	setPlayerSymbol: React.Dispatch<React.SetStateAction<CellState>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const App = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [user, setUser] = useState<User | null>(null);

	const [game, setGame] = useState<Game>(new Game(3, 3));
	const [playerSymbol, setPlayerSymbol] = useState<CellState>(CellState.Cross);

	const { isLoading, isLoggedIn, setIsLoggedIn } = useAuth(IDENTITY_URL, searchParams, setSearchParams, {
		optional: true,
		identityApiUrl: IDENTITY_API_URL,
	});

	const logout = useCallback(() => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
		setUser(null);
	}, [setIsLoggedIn, setUser]);

	useEffect(() => {
		if (isLoggedIn) {
			(async () => {
				setUser(await getUser());
			})();
		}
	}, [isLoggedIn]);

	const value = useMemo((): AppContextType => {
		return { game, playerSymbol, user, isLoggedIn, setGame, logout, setPlayerSymbol };
	}, [game, playerSymbol, user, isLoggedIn, logout, setPlayerSymbol, setGame]);

	return (
		<AppContext.Provider value={value}>
			<SessionContextProvider>
				<GridContextProvider>
					<div className="app vh-100 w-100 d-flex align-items-center flex-column p-3 gap-2">
						{isLoading ? (
							<div className="d-flex vh-100 align-items-center">
								<BallTriangle stroke="black" />
							</div>
						) : (
							<>
								<Header user={user} />
								<Home />
							</>
						)}
					</div>
				</GridContextProvider>
			</SessionContextProvider>
		</AppContext.Provider>
	);
};

export default App;
