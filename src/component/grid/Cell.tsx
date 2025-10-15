import { useContext, useMemo } from "react";
import { GridContext } from "@context/GridContext";

// HELPERS
import { CellState } from "@helpers/GameHelper";

// ICONS
import { RxCross1, RxCircle  } from "react-icons/rx";

export interface CellProps {
    value: CellState;
    row: number;
    col: number;
}

const Cell = ({ value, row, col }: CellProps) => {
    const { onCellClick, game } = useContext(GridContext);

    const text = useMemo(() => {
        switch (value) {
            case CellState.Empty: return '';
            case CellState.Cross: return <RxCross1 className="fs-1"/>;
            case CellState.Circle: return <RxCircle className="fs-1"/>;
        };
    }, [value]);

    const disabled = game.IsGameOver;

    return (
        <div className="col-sm p-0 game-cell">
            <button 
                className={`card btn ${(!disabled ? 'btn-secondary': 'btn-danger')} w-100 h-100 border-1 shadow-sm d-flex align-items-center justify-content-center m-0 p-0`}
                style={{aspectRatio: '1 / 1', overflow: "hidden"}}
                onClick={() => onCellClick(row, col)}
            >
                <h5 className="p-0 m-0 text-center w-100">{text}</h5>
            </button>
        </div>
    );
}

export default Cell;