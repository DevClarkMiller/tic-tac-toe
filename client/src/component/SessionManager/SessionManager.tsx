import { useContext, useEffect, useState } from 'react';
import JoinSessionManagerModal from './JoinSessionManagerModal';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { SessionContext } from '@context/SessionContext';

import { FaRegCopy, FaQrcode } from 'react-icons/fa';
import SessionQRModal from './SessionQRModal';
import { useSearchParams } from 'react-router';

const SessionManager = () => {
	const [joinSessionModalOpen, setJoinSessionModalOpen] = useState(false);
	const [sessionQRModalOpen, setSessionQRModalOpen] = useState(false);

	const { leaveSession, joinSession, createSession, sessionId, isConnected, inGame } = useContext(SessionContext);

	const [searchParams, setSearchParams] = useSearchParams();
	const paramSessionId = searchParams.get('sessionId');

	useEffect(() => {
		if (!isConnected || !paramSessionId) return;

		joinSession(paramSessionId);

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.delete('sessionId');
		setSearchParams(newSearchParams);
	}, [isConnected, joinSession, paramSessionId, searchParams, setSearchParams]);

	const copyLinkToClipboard = async () => {
		await navigator.clipboard.writeText(sessionId);
	};

	if (inGame) {
		return (
			<div className="d-flex align-items-center gap-2">
				<OverlayTrigger placement="top" overlay={<Tooltip id="info-tooltip">SessionID: {sessionId}</Tooltip>}>
					<span style={{ cursor: 'pointer' }}>
						<FaRegCopy onClick={copyLinkToClipboard} className="h4 text-secondary m-0" />
					</span>
				</OverlayTrigger>
				<button onClick={() => setSessionQRModalOpen(!sessionQRModalOpen)} className="btn btn-icon p-0">
					<FaQrcode />
				</button>
				<button onClick={leaveSession} className="btn btn-primary">
					Disconnect
				</button>
				{sessionQRModalOpen && <SessionQRModal sessionId={sessionId} setIsOpen={setSessionQRModalOpen} />}
			</div>
		);
	}

	return (
		<div className="d-flex justify-content-center gap-3">
			<button onClick={createSession} className="btn btn-primary">
				Create Game
			</button>

			<button onClick={() => setJoinSessionModalOpen(!joinSessionModalOpen)} className="btn btn-primary">
				Join Game
			</button>

			{joinSessionModalOpen && (
				<JoinSessionManagerModal joinSession={joinSession} setIsOpen={setJoinSessionModalOpen} />
			)}
		</div>
	);
};

export default SessionManager;
