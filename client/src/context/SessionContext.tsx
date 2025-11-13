import { useMemo, createContext, type ReactNode, useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import type { Message } from 'types/Message';

export interface SessionContextType {
	connection: signalR.HubConnection | null;
	messages: Message[];
	// eslint-disable-next-line no-unused-vars
	sendMessage: (msg: string) => Promise<void>;
}

export const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export const SessionContextProvider = ({ children }: { children: ReactNode }) => {
	const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const newConnection = new signalR.HubConnectionBuilder()
			.withUrl('http://localhost:5229/chathub', { withCredentials: true })
			.withAutomaticReconnect()
			.build();

		setConnection(newConnection);
	}, []);

	const startConnection = useCallback(async () => {
		try {
			await connection?.start();
			connection?.on('ReceiveMessage', (user: string, msg: string) => {
				setMessages(prev => [...prev, { user: user, content: msg, dataReceived: new Date() }]);
			});
		} catch (err: unknown) {
			console.error(err);
		}
	}, [connection]);

	const sendMessage = useCallback(
		async (msg: string) => {
			await connection?.invoke('SendMessage', 'Clark', msg);
		},
		[connection]
	);

	useEffect(() => {
		if (connection) startConnection();
	}, [connection, startConnection]);

	const value = useMemo(() => {
		return { connection, messages, sendMessage };
	}, [connection, messages, sendMessage]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionContextProvider;
