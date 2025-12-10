import type { FontControlType } from 'types/FontControlType';
import type { Message } from 'types/Message';

const UserMessage = ({ fontSizes, message }: { fontSizes: FontControlType; message: Message }) => {
	return (
		<div
			className="h5 d-flex flex-column text-start rounded-2 p-1"
			style={{ width: '90%', border: '1px solid gray', overflowWrap: 'anywhere' }}>
			<div className="text-secondary h6 p-0 m-0" style={{ fontSize: `${fontSizes.messageHeader}px` }}>
				<span>{message.dateReceived.toLocaleTimeString()}</span> -{' '}
				<span className="fw-bold">{message.user}</span>
			</div>
			<div>
				<span className="fw-normal" style={{ fontSize: `${fontSizes.messageContent}px` }}>
					{message.content}
				</span>
			</div>
		</div>
	);
};

export default UserMessage;
