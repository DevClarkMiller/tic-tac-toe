import { useContext } from 'react';

// CONTEXT
import { GridContext } from '../../context/GridContext';

// COMPONENT
import Row from './Row';

const Grid = () => {
    const { grid } = useContext(GridContext);

    return (
        <div className='container w-100 h-100 p-0' id='grid'>
            { grid?.map((values, row) => (
                <Row 
                    key={row} 
                    values={values} 
                    row={row} 
                />
                ))
            }
        </div>
    );
};

export default Grid;