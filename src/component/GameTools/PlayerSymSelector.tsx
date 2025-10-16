import { useState, type JSX } from 'react';
import { CellState } from '@game/CellState';

import Select from 'react-select';

// ICONS
import { RxCircle, RxCross1 } from 'react-icons/rx';

interface Option {
	value: CellState;
	label: JSX.Element;
}

const PlayerSymSelector = ({
	gameStarted,
	playerSymbol,
	setPlayerSymbol,
}: {
	gameStarted: boolean;
	playerSymbol: CellState;
	setPlayerSymbol: React.Dispatch<React.SetStateAction<CellState>>;
}) => {
	const options: Option[] = [
		{ value: CellState.Cross, label: <RxCross1 /> },
		{ value: CellState.Circle, label: <RxCircle /> },
	];

	const [selectedOption, setSelectedOption] = useState<Option>(
		options.find((opt) => opt.value === playerSymbol) ?? options[0],
	);

	const onSelect = (option: Option | null) => {
		if (!option || gameStarted) return;
		setPlayerSymbol(option.value);
		setSelectedOption(option);
	};

	return (
		<div className="d-flex justify-content-center align-items-center">
			<h3 className="me-2">Player</h3>
			<Select<Option, false>
				isDisabled={gameStarted}
				value={selectedOption}
				onChange={onSelect}
				options={options}
				isSearchable={false}
			/>
		</div>
	);
};

export default PlayerSymSelector;
