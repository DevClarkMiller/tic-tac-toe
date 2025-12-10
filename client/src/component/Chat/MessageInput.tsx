import type { User } from 'helios-identity-sdk';
import { useState } from 'react';

const MessageInput = ({ user, sendMessage }: { user: User; sendMessage: (_msg: string, _user: User) => void }) => {
	const [text, setText] = useState<string>('');

	const onSend = (e: any) => {
		if (e.preventDefault) e.preventDefault();
		if (text) sendMessage(text, user);
		setText('');
	};

	return (
		<form onSubmit={onSend}>
			<div className="input-group input-group-sm">
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

export default MessageInput;
