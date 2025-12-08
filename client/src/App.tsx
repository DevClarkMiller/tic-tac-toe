import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUser, IDENTITY_API_URL, IDENTITY_URL } from 'services/Identity';
import { useAuth, type User } from 'helios-identity-sdk';

// CSS
import './App.css';

// COMPONENT
import Grid from './component/Grid/Grid';
import { BallTriangle } from 'react-loading-icons';

// CONTEXT
import { GridContextProvider } from './context/GridContext';
import GameTools from './component/GameTools/GameTools';
import Chat from '@components/Chat/Chat';
import Header from '@components/Header/Header';
import SessionContextProvider from '@context/SessionContext';
import SessionManager from '@components/SessionManager/SessionManager';

export interface AppContextType {
	isLoggedIn: boolean;
	user: User | null;
	logout: () => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const App = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [user, setUser] = useState<User | null>(null);
	const { isLoading, isLoggedIn, setIsLoggedIn } = useAuth(IDENTITY_URL, searchParams, setSearchParams, {
		optional: true,
		identityApiUrl: IDENTITY_API_URL,
	});

	const logout = useCallback(() => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
	}, [setIsLoggedIn]);

	useEffect(() => {
		if (isLoggedIn) {
			(async () => {
				setUser(await getUser());
			})();
		}
	}, [isLoggedIn]);

	const value = useMemo((): AppContextType => {
		return { user, isLoggedIn, logout };
	}, [user, isLoggedIn, logout]);

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
								<Header />
								<div
									className="h-100 w-75 d-flex flex-column flex-grow-1 justify-content-between align-items-center gap-2"
									style={{ maxWidth: '650px' }}>
									<GameTools />
									{isLoggedIn && <SessionManager />}
									<Grid />
									<Chat />
								</div>
							</>
						)}
					</div>
				</GridContextProvider>
			</SessionContextProvider>
		</AppContext.Provider>
	);
};

export default App;
