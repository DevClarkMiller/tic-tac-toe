import { useCallback, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface Message {
	user: string;
	content: string;
	dataReceived: Date;
}

const UserMessage = ({ message }: { message: Message }) => {
	return (
		<div className="h5 d-flex flex-column text-start w-100">
			<div className="text-secondary h6 p-0 m-0">{message.dataReceived.toLocaleTimeString()}</div>
			<div>
				<span className="fw-bold">{message.user}</span>
				<span className="fw-normal">: {message.content}</span>
			</div>
		</div>
	);
};

// eslint-disable-next-line no-unused-vars
const MessageInput = ({ sendMessage }: { sendMessage: (msg: string) => void }) => {
	const [text, setText] = useState<string>('');

	const onSend = (e: any) => {
		if (e.preventDefault) e.preventDefault();
		if (text) sendMessage(text);
	};

	return (
		<form onSubmit={onSend}>
			<div className="input-group input-group-sm mb-3">
				<button className="btn btn-outline-secondary" type="submit">
					Send
				</button>
				<input
					type="text"
					className="form-control"
					aria-label="Small"
					aria-describedby="inputGroup-sizing-sm"
					value={text}
					placeholder="Enter your message..."
					onChange={e => {
						setText(e.target.value);
					}}
				/>
			</div>
		</form>
	);
};

const Chat = () => {
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

	const sendMessage = async (msg: string) => {
		await connection?.invoke('SendMessage', 'Clark', msg);
	};

	useEffect(() => {
		if (connection) startConnection();
	}, [connection, startConnection]);

	return (
		<div className="w-100">
			<h2>Chat</h2>
			<div data-bs-spy="scroll"></div>
			{messages.map((message: Message) => (
				<UserMessage key={message.user + '-' + message.dataReceived} message={message} />
			))}
			<MessageInput sendMessage={sendMessage} />
		</div>
	);
};

export default Chat;
