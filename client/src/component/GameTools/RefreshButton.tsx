// ICONS
import { IoIosRefresh } from 'react-icons/io';
import { useContext } from 'react';
import { GridContext } from '@context/GridContext';

const RefreshButton = () => {
	const { restartGame } = useContext(GridContext);
	return (
		<>
			<button
				onClick={restartGame}
				className="d-none d-md-flex p-0 btn-icon btn bg-transparent fs-2 d-flex align-content-center icon-link-hover">
				<IoIosRefresh />
			</button>
			<button onClick={restartGame} className="d-md-none btn btn-secondary w-100">
				Refresh
			</button>
		</>
	);
};

export default RefreshButton;
