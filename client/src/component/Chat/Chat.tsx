import { useContext, useEffect, useRef, useState } from 'react';
import type { Message } from 'types/Message';
import { SessionContext } from '@context/SessionContext';
import { AppContext } from 'App';
import type { FontControlType } from 'types/FontControlType';
import { MESSAGE_FONT_CONTENT_DEFAULT, MESSAGE_FONT_HEADER_DEFAULT } from 'constants/ChatConstants';
import ChatHeader from './ChatHeader/ChatHeader';
import MessageInput from './MessageInput';
import UserMessage from './UserMessage';

const Chat = () => {
	const { messages, sendMessage } = useContext(SessionContext);
	const { user } = useContext(AppContext);

	const messagesEndRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!messagesEndRef.current) return;

		console.log('SCROLLING');
		messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
	}, [messages]);

	const [fontSizes, setFontSizes] = useState<FontControlType>({
		messageHeader: MESSAGE_FONT_HEADER_DEFAULT,
		messageContent: MESSAGE_FONT_CONTENT_DEFAULT,
	});

	return (
		<div className="w-100 rounded-2 p-1 pe-0" style={{ border: '1px solid gray' }}>
			<ChatHeader fontSizes={fontSizes} setFontSizes={setFontSizes} />
			<div className="overflow-y-scroll chat-container" data-bs-spy="scroll" ref={messagesEndRef}>
				{messages.map((message: Message, idx: number) => (
					<UserMessage fontSizes={fontSizes} key={message.user + '-' + idx} message={message} />
				))}
				<div ref={messagesEndRef as any} />
			</div>
			<MessageInput user={user!} sendMessage={sendMessage} />
		</div>
	);
};

export default Chat;
