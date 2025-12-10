import { useContext, useState } from 'react';
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

	const [fontSizes, setFontSizes] = useState<FontControlType>({
		messageHeader: MESSAGE_FONT_HEADER_DEFAULT,
		messageContent: MESSAGE_FONT_CONTENT_DEFAULT,
	});

	return (
		<div className="w-100 rounded-2 p-1 pe-0" style={{ border: '1px solid gray' }}>
			<ChatHeader fontSizes={fontSizes} setFontSizes={setFontSizes} />
			<div className="overflow-y-scroll chat-container" data-bs-spy="scroll">
				{messages.map((message: Message) => (
					<UserMessage
						fontSizes={fontSizes}
						key={message.user + '-' + message + '-' + message.dateReceived}
						message={message}
					/>
				))}
			</div>
			<MessageInput user={user!} sendMessage={sendMessage} />
		</div>
	);
};

export default Chat;
