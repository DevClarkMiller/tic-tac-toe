export interface CellProps {
    value: number;
    index: number;
}

const Cell = ({ value, index }: CellProps) => {
    return (
        <div className="col-sm card">
            <div className="card-body">
                Card
            </div>
        </div>
    );
}

export default Cell;