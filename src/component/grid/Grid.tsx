import { useContext } from 'react';

// CONTEXT
import { GridContext } from '../../context/GridContext';

// COMPONENT
import Row from './Row';

const Grid = () => {
    const { grid } = useContext(GridContext);

    return (
        <div className='container' id='grid'>
            { grid?.map((row, index) => <Row key={index} row={row} index={index} />) }
        </div>
    );
};

export default Grid;