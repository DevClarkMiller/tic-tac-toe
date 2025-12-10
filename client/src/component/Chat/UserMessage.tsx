import { getUsername } from '@helpers/UserHelper';
import { AppContext } from 'App';
import { useContext, useMemo } from 'react';
import type { FontControlType } from 'types/FontControlType';
import type { Message } from 'types/Message';

const MessageHeader = ({
	isCurrentUser,
	message,
	fontSize,
}: {
	isCurrentUser: boolean;
	message: Message;
	fontSize: number;
}) => {
	const username = isCurrentUser ? 'You' : message.user;

	return (
		<div className="text-secondary h6 p-0 m-0" style={{ fontSize: `${fontSize}px` }}>
			<span>{message.dateReceived.toLocaleTimeString()}</span> - <span className="fw-bold">{username}</span>
		</div>
	);
};

const UserMessage = ({ fontSizes, message }: { fontSizes: FontControlType; message: Message }) => {
	const { user } = useContext(AppContext);
	const isCurrentUser = useMemo(() => message.user == getUsername(user!), [user, message]);

	const justifyContent = isCurrentUser ? 'justify-content-end pe-1' : 'justify-content-start';

	return (
		<div className={`d-flex w-100 ${justifyContent}`}>
			<div
				className="h5 d-flex flex-column text-start rounded-2 p-1"
				style={{ width: '80%', border: '1px solid gray', overflowWrap: 'anywhere' }}>
				<MessageHeader isCurrentUser={isCurrentUser} message={message} fontSize={fontSizes.messageHeader} />
				<div>
					<span className="fw-normal" style={{ fontSize: `${fontSizes.messageContent}px` }}>
						{message.content}
					</span>
				</div>
			</div>
		</div>
	);
};

export default UserMessage;
