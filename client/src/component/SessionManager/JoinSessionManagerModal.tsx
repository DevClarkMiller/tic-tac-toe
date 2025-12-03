import React, { useState } from 'react';

export interface JoinSessionManagerModalProps {
	joinSession: (_sessionId: string) => void;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinSessionManagerModal = ({ joinSession, setIsOpen }: JoinSessionManagerModalProps) => {
	const [newSessionId, setNewSessionId] = useState('');

	const onClose = () => {
		setIsOpen(false);
	};

	const onDone = () => {
		joinSession(newSessionId);
		setIsOpen(false);
	};

	return (
		<div className="modal fade show d-block">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="staticBackdropLabel">
							Join Multiplayer Session
						</h1>
						<button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
					</div>
					<div className="modal-body">
						<div>
							<label className="fw-bold" htmlFor="session-id-input">
								Session ID
							</label>
							<input
								value={newSessionId}
								onChange={e => setNewSessionId(e.target.value)}
								className="form-control"
								id="session-id-input"
								name="session-id-input"
								placeholder="Enter Session ID..."
							/>
						</div>
					</div>
					<div className="modal-footer">
						<button onClick={onClose} type="button" className="btn btn-secondary">
							Close
						</button>
						<button onClick={onDone} type="button" className="btn btn-primary">
							Done
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default JoinSessionManagerModal;
