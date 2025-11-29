import Cell from './Cell';

export interface RowProps {
	values: number[];
	row: number;
}

const Row = ({ values, row }: RowProps) => {
	return (
		<div className="w-100 d-flex">
			{values.map((value, col) => (
				<Cell key={`${row}-${col}`} value={value} row={row} col={col} />
			))}
		</div>
	);
};

export default Row;
