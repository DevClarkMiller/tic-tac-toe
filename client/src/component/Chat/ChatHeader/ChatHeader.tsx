import React from 'react';
import ChatFontSizeControls from './ChatFontSizeControls';
import type { FontControlType } from 'types/FontControlType';

const ChatHeader = ({
	fontSizes,
	setFontSizes,
}: {
	fontSizes: FontControlType;
	setFontSizes: React.Dispatch<React.SetStateAction<FontControlType>>;
}) => {
	return (
		<div className="d-flex justify-content-between align-items-center">
			<h2 className="m-0">Chat</h2>
			<ChatFontSizeControls fontSizes={fontSizes} setFontSizes={setFontSizes} />
		</div>
	);
};

export default ChatHeader;
