import { useContext, useMemo } from "react";
import { GridContext } from "../../context/GridContext";

export interface CellProps {
    value: number;
    row: number;
    col: number;
}

const Cell = ({ value, row, col }: CellProps) => {
    const { onCellClick } = useContext(GridContext);

    const text = useMemo(() => {
        switch (value) {
            case -1: return '';
            case 0: return 'X';
        };
    }, [value]);

    return (
        <div className="col-sm p-0">
            <button 
                className="card btn btn-secondary w-100 h-100 text-center border-1 shadow-sm m-0 p-5"
                onClick={() => onCellClick(row, col)}
            >
                <div className="card-body p-0">
                    <h5 className="card-title np-0 m-0">{text}</h5>
                </div>
            </button>
        </div>
    );
}

export default Cell;