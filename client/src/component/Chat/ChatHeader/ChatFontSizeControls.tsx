import React from 'react';

import {
	FONT_SIZE_CHANGE_MAX_DIFF,
	MESSAGE_FONT_CONTENT_DEFAULT,
	MESSAGE_FONT_HEADER_DEFAULT,
} from 'constants/ChatConstants';

import { CiSquarePlus, CiSquareMinus } from 'react-icons/ci';
import type { FontControlType } from 'types/FontControlType';

const ChatFontSizeControls = ({
	fontSizes,
	setFontSizes,
}: {
	fontSizes: FontControlType;
	setFontSizes: React.Dispatch<React.SetStateAction<FontControlType>>;
}) => {
	const adjustSizes = (
		newSizes: FontControlType,
		mod: number,
		isValidCallback: (fontSize: number, fontSizeLimit: number) => boolean
	) => {
		newSizes.messageHeader += mod;
		newSizes.messageContent += mod;

		if (
			isValidCallback(fontSizes.messageHeader, MESSAGE_FONT_HEADER_DEFAULT + FONT_SIZE_CHANGE_MAX_DIFF * mod) &&
			isValidCallback(fontSizes.messageContent, MESSAGE_FONT_CONTENT_DEFAULT + FONT_SIZE_CHANGE_MAX_DIFF * mod)
		)
			setFontSizes(newSizes);
	};

	const increment = () => {
		adjustSizes({ ...fontSizes }, 1, (fontSize, fontSizeLimit) => fontSize <= fontSizeLimit);
	};

	const decrement = () => {
		adjustSizes({ ...fontSizes }, -1, (fontSize, fontSizeLimit) => fontSize >= fontSizeLimit);
	};

	return (
		<div className="d-flex align-items-center bg-transparent">
			<button onClick={decrement} className="btn chat-font-size-control p-0">
				<CiSquareMinus />
			</button>
			<button onClick={increment} className="btn chat-font-size-control p-0">
				<CiSquarePlus />
			</button>
		</div>
	);
};

export default ChatFontSizeControls;
