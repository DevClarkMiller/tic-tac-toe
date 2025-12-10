import { useContext, useMemo } from 'react';
import { GridContext } from '@context/GridContext';

// HELPERS
import { CellState } from '@helpers/GameHelper';

// ICONS
import { RxCross1, RxCircle } from 'react-icons/rx';
import { AppContext } from 'App';

export interface CellProps {
	value: CellState;
	row: number;
	col: number;
}

const Cell = ({ value, row, col }: CellProps) => {
	const { game } = useContext(AppContext);
	const { onCellClick } = useContext(GridContext);

	const text = useMemo(() => {
		switch (value) {
			case CellState.Empty:
				return '';
			case CellState.Cross:
				return <RxCross1 className="fs-1" />;
			case CellState.Circle:
				return <RxCircle className="fs-1" />;
		}
	}, [value]);

	const btnType = !game.IsGameOver ? 'btn-secondary' : 'btn-danger';

	return (
		<div className="p-0 m-0 w-100">
			<button
				className={`card btn ${btnType} d-flex w-100 h-100 border-1 shadow-sm align-items-center justify-content-center m-0 p-0`}
				style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}
				onClick={() => onCellClick(row, col)}>
				<h5 className="w-100 p-0 m-0 text-center">{text}</h5>
			</button>
		</div>
	);
};

export default Cell;
