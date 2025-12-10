import { useMemo, createContext, type ReactNode, useEffect, useState, useCallback, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Message } from 'types/Message';
import { getSignalRConnection } from 'services/Site';
import { AppContext } from 'App';
import type { User } from 'helios-identity-sdk';
import { getUsername } from '@helpers/UserHelper';

export interface SessionContextType {
	isConnected: boolean;
	connection: signalR.HubConnection | null;
	sessionId: string;
	messages: Message[];

	sendMessage: (_msg: string, _usr: User) => Promise<void>;
	createSession: () => Promise<void>;
	joinSession: (_sessionId: string) => Promise<void>;
	leaveSession: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
	const [sessionId, setSessionId] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);

	const { isLoggedIn } = useContext(AppContext);

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

	const createSession = useCallback(async () => {
		const newSessionId = await connection?.invoke('CreateSession');
		setSessionId(newSessionId);
		setIsConnected(true);
	}, [connection]);

	const joinSession = useCallback(
		async (newSessionId: string) => {
			await connection?.invoke('JoinSession', newSessionId);
			setSessionId(newSessionId);
			setIsConnected(true);
		},
		[connection]
	);

	const leaveSession = useCallback(async () => {
		await connection?.invoke('LeaveSession', sessionId);
		setIsConnected(false);
		setSessionId('');
		setMessages([]);
	}, [connection, sessionId]);

	useEffect(() => {
		if (connection) startConnection();
	}, [connection, startConnection]);

	const value = useMemo(() => {
		return { sessionId, isConnected, connection, messages, createSession, joinSession, leaveSession, sendMessage };
	}, [connection, createSession, isConnected, joinSession, leaveSession, messages, sendMessage, sessionId]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionContextProvider;
