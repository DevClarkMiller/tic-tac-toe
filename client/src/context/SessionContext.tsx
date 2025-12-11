import { useMemo, createContext, type ReactNode, useEffect, useState, useCallback, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Message } from 'types/Message';
import { getSignalRConnection } from 'services/Site';
import { AppContext } from 'App';
import type { User } from 'helios-identity-sdk';
import { getUsername } from '@helpers/UserHelper';
import type { PlayerInfo } from '@models/PlayerInfo';
import { Game } from '@game/Game';
import type { CellState } from '@game/CellState';

export interface SessionContextType {
	isConnected: boolean;
	inGame: boolean;
	connection: signalR.HubConnection | null;
	sessionId: string;
	messages: Message[];

	sendMessage: (_msg: string, _usr: User) => Promise<void>;
	createSession: () => Promise<void>;
	joinSession: (_sessionId: string) => Promise<void>;
	leaveSession: () => Promise<void>;
	sendMove: (row: number, column: number) => Promise<void>;
	restartGameRemote: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
	const [inGame, setInGame] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
	const [sessionId, setSessionId] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);

	const { isLoggedIn, playerSymbol, setPlayerSymbol } = useContext(AppContext);
	const { setGame } = useContext(AppContext);

	useEffect(() => {
		if (isLoggedIn) {
			const newConnection = getSignalRConnection();
			setConnection(newConnection);
		}
	}, [isLoggedIn]);

	const startConnection = useCallback(async () => {
		try {
			await connection?.start();
			connection?.on('ReceiveMessage', (user: string, msg: string) => {
				setMessages(prev => [...prev, { user: user, content: msg, dateReceived: new Date() }]);
			});
			connection?.on('GameOver', (winner: CellState) => {
				setGame(prevGame => {
					const newGame = prevGame.Clone();
					newGame.IsGameOver = true;
					newGame.Winner = winner;
					return newGame;
				});
			});
			setIsConnected(true);
		} catch (err: unknown) {
			console.error(err);
		}
	}, [connection, setGame]);

	const sendMessage = useCallback(
		async (msg: string, user: User) => {
			const userName = getUsername(user);
			await connection?.invoke('SendMessage', userName, msg, sessionId);
		},
		[connection, sessionId]
	);

	const sendMove = useCallback(
		async (row: number, column: number) => {
			await connection?.invoke('SendGameMove', row, column, sessionId);
		},
		[connection, sessionId]
	);

	const getPlayerInfo = useCallback(
		async (sessId: string) => {
			return (await connection?.invoke('GetPlayerInfo', sessId)!) as PlayerInfo | null;
		},
		[connection]
	);

	const createSession = useCallback(async () => {
		const newSessionId = await connection?.invoke('CreateSession', playerSymbol);
		setSessionId(newSessionId);
		setInGame(true);
		setGame(prevGame => {
			const newGame = new Game(prevGame.Rows, prevGame.Cols);
			newGame.ActivePlayer = playerSymbol;
			newGame.GameStarted = true;
			return newGame;
		});
	}, [connection, playerSymbol, setGame]);

	const getActivePlayer = useCallback(async () => {
		return await connection?.invoke('GetActivePlayer', sessionId);
	}, [connection, sessionId]);

	const restartGameRemote = useCallback(async () => {
		await connection?.invoke('RestartGame', sessionId);
		const activePlayer = await getActivePlayer();
		setGame(prevGame => {
			const updatedGame = prevGame.Clone();
			updatedGame.ActivePlayer = activePlayer;
			updatedGame.GameStarted = true;
			return updatedGame;
		});
	}, [connection, getActivePlayer, sessionId, setGame]);

	const joinSession = useCallback(
		async (newSessionId: string) => {
			const joinedSession = await connection?.invoke('JoinSession', newSessionId);
			if (!joinedSession) return;
			setSessionId(newSessionId);
			setInGame(true);

			const activePlayer = await getActivePlayer();

			setGame(prevGame => {
				const gameToUpdate = prevGame.Clone();
				gameToUpdate.GameStarted = true;
				gameToUpdate.ActivePlayer = activePlayer;
				return gameToUpdate;
			});

			const playerInfo = await getPlayerInfo(newSessionId);
			if (playerInfo) setPlayerSymbol(playerInfo.symbol);
		},
		[connection, getPlayerInfo, getActivePlayer, setGame, setPlayerSymbol]
	);

	const leaveSession = useCallback(async () => {
		await connection?.invoke('LeaveSession', sessionId);
		setGame(prevGame => prevGame.GetResetGame(playerSymbol));
		setSessionId('');
		setMessages([]);
		setInGame(false);
	}, [connection, playerSymbol, sessionId, setGame]);

	useEffect(() => {
		if (connection) startConnection();
	}, [connection, startConnection]);

	const value = useMemo(() => {
		return {
			inGame,
			sessionId,
			isConnected,
			connection,
			messages,
			createSession,
			joinSession,
			leaveSession,
			sendMessage,
			sendMove,
			restartGameRemote,
		};
	}, [
		connection,
		inGame,
		isConnected,
		sessionId,
		messages,
		joinSession,
		leaveSession,
		createSession,
		sendMessage,
		sendMove,
		restartGameRemote,
	]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionContextProvider;
