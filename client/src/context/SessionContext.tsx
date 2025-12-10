import { useMemo, createContext, type ReactNode, useEffect, useState, useCallback, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Message } from 'types/Message';
import { getSignalRConnection } from 'services/Site';
import { AppContext } from 'App';
import type { User } from 'helios-identity-sdk';
import { getUsername } from '@helpers/UserHelper';
import type { PlayerInfo } from '@models/PlayerInfo';

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
}

export const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
	const [inGame, setInGame] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
	const [sessionId, setSessionId] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);

	const { isLoggedIn, playerSymbol, setPlayerSymbol } = useContext(AppContext);
	const { game } = useContext(AppContext);

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
			setIsConnected(true);
		} catch (err: unknown) {
			console.error(err);
		}
	}, [connection]);

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
		game.GameStarted = true;
	}, [connection, game, playerSymbol]);

	const joinSession = useCallback(
		async (newSessionId: string) => {
			const joinedSession = await connection?.invoke('JoinSession', newSessionId);
			if (!joinedSession) return;
			setSessionId(newSessionId);
			setInGame(true);
			game.GameStarted = true;

			const playerInfo = await getPlayerInfo(newSessionId);
			console.log(playerInfo);
			if (playerInfo) setPlayerSymbol(playerInfo.symbol);
		},
		[connection, game, getPlayerInfo, setPlayerSymbol, setSessionId]
	);

	const leaveSession = useCallback(async () => {
		await connection?.invoke('LeaveSession', sessionId);
		setSessionId('');
		setMessages([]);
		setInGame(false);
	}, [connection, sessionId]);

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
		};
	}, [
		connection,
		createSession,
		inGame,
		isConnected,
		joinSession,
		leaveSession,
		messages,
		sendMessage,
		sendMove,
		sessionId,
	]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionContextProvider;
