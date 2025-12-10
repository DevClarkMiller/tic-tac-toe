import { SITE_URL } from 'constants/SiteConstants';
import React from 'react';
import QRCode from 'react-qr-code';

export interface SessionQRModalProps {
	sessionId: string;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SessionQRModal = ({ sessionId, setIsOpen }: SessionQRModalProps) => {
	const onClose = () => {
		setIsOpen(false);
	};

	const url = new URL(SITE_URL);
	url.searchParams.set('sessionId', sessionId);
	console.log(url.toString());

	return (
		<div className="modal fade show d-block">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h1 className="modal-title fs-5" id="staticBackdropLabel">
							Multiplayer Session QR Code
						</h1>
						<button onClick={onClose} type="button" className="btn-close" aria-label="Close"></button>
					</div>
					<div className="modal-body d-flex justify-content-center align-items-center">
						<QRCode value={url.toString()} />
					</div>
					<div className="modal-footer">
						<button onClick={onClose} type="button" className="btn btn-secondary">
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionQRModal;
