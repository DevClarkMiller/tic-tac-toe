import { useContext } from 'react';

// CONTEXT
import { AppContext } from 'App';

// COMPONENT
import Row from './Row';

const Grid = () => {
	const { game } = useContext(AppContext);

	return (
		<div className="w-100 h-100 p-0 m-0" id="grid">
			{game.Grid?.map((values, row) => (
				<Row key={row} values={values} row={row} />
			))}
		</div>
	);
};

export default Grid;
