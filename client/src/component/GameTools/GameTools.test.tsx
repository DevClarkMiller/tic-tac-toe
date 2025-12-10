import { render as renderDef, within } from '@testing-library/react';
import GameTools from './GameTools';
import { GridContext } from '@context/GridContext';

import { CellState } from '@game/CellState';

describe('GameTools test suite', () => {
	const render = (playerSymbol: CellState = CellState.Cross) => {
		const gridContextValue = {
			game: {},
			playerSymbol: playerSymbol,
			setGame: jest.fn(),
			setPlayerSymbol: jest.fn(),
		};

		return renderDef(
			<GridContext.Provider value={gridContextValue as any}>
				<GameTools />
			</GridContext.Provider>
		);
	};

	test('has required text', () => {
		const REQUIRED_TEXT = ['Player', 'Difficulty'];

		const { getByText } = render();
		REQUIRED_TEXT.forEach(text => {
			expect(getByText(text)).toBeInTheDocument();
		});
	});

	// TODO: FINISH TEST

	test.each([
		['cross', CellState.Circle],
		['circle', CellState.Cross],
	])('has correct player symbol when %s', (_, symbol) => {
		const symSelectorParent = render(symbol).getByTestId('player-symbol-selector');

		expect(symSelectorParent).toBeInTheDocument();

		const { getByRole } = within(symSelectorParent);
		const selector = getByRole('combobox');
		expect(selector).toBeInTheDocument();
	});
});
