import { useState, type JSX } from 'react';
import Select from 'react-select';
import type GameProp from 'types/GameProp';
import { Difficulty } from '@game/Difficulty';

// ICONS
import { FaChild, FaBaby } from 'react-icons/fa6';
import { IoIosMan } from 'react-icons/io';

interface Option {
	value: number;
	label: JSX.Element;
}

const DifficultySelector = ({ game, setGame }: GameProp) => {
	const options: Option[] = [
		{ value: Difficulty.Hard, label: <IoIosMan /> },
		{ value: Difficulty.Medium, label: <FaChild /> },
		{ value: Difficulty.Easy, label: <FaBaby /> },
	];

	const [selectedOption, setSelectedOption] = useState<Option>(
		options.find(opt => opt.value === game.Difficulty) ?? options[0]
	);

	const onSelect = (option: Option | null) => {
		if (!option || game.GameStarted) return;
		const newGame = game.Clone();
		newGame.Difficulty = option.value;
		setGame(newGame);
		setSelectedOption(option);
	};

	return (
		<div className="w-100 d-flex justify-content-between align-items-center">
			<h3 className="me-2">Difficulty</h3>
			<Select<Option, false>
				isDisabled={game.GameStarted}
				value={selectedOption}
				onChange={onSelect}
				options={options}
				isSearchable={false}
			/>
		</div>
	);
};

export default DifficultySelector;
