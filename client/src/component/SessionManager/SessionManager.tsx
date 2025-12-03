import { useContext, useState } from 'react';
import JoinSessionManagerModal from './JoinSessionManagerModal';

import { FaRegCopy } from 'react-icons/fa';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { SessionContext } from '@context/SessionContext';

const SessionManager = () => {
	const [modalOpen, setModalOpen] = useState(false);

	const { leaveSession, joinSession, createSession, sessionId, isConnected } = useContext(SessionContext);

	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	const copyLinkToClipboard = async () => {
		await navigator.clipboard.writeText(sessionId);
	};

	if (isConnected) {
		return (
			<div className="d-flex align-items-center gap-2">
				<OverlayTrigger placement="top" overlay={<Tooltip id="info-tooltip">SessionID: {sessionId}</Tooltip>}>
					<span style={{ cursor: 'pointer' }}>
						<FaRegCopy onClick={copyLinkToClipboard} className="h4 text-secondary m-0" />
					</span>
				</OverlayTrigger>
				<button onClick={leaveSession} className="btn btn-primary">
					Disconnect
				</button>
			</div>
		);
	}

	return (
		<div className="d-flex justify-content-center gap-3">
			<button onClick={createSession} className="btn btn-primary">
				Create Game
			</button>

			<button onClick={toggleModal} className="btn btn-primary">
				Join Game
			</button>

			{modalOpen && <JoinSessionManagerModal joinSession={joinSession} setIsOpen={setModalOpen} />}
		</div>
	);
};

export default SessionManager;
