import { useContext, useState } from 'react';
import type { Message } from 'types/Message';
import { SessionContext } from '@context/SessionContext';

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

const MessageInput = ({ sendMessage }: { sendMessage: (_msg: string) => void }) => {
	const [text, setText] = useState<string>('');

	const onSend = (e: any) => {
		if (e.preventDefault) e.preventDefault();
		if (text) sendMessage(text);
		setText('');
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
	const { isConnected, messages, sendMessage } = useContext(SessionContext);

	if (!isConnected) return null;

	return (
		<div className="w-100">
			<h2>Chat</h2>
			<div className="overflow-scroll" data-bs-spy="scroll" style={{ maxHeight: '200px' }}>
				{messages.map((message: Message) => (
					<UserMessage key={message.user + '-' + message.dataReceived} message={message} />
				))}
			</div>
			<MessageInput sendMessage={sendMessage} />
		</div>
	);
};

export default Chat;
