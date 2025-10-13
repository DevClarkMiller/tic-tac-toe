import Cell from "./Cell";

export interface RowProps {
    row: number[];
    index: number;
}

const Row = ({ row, index }: RowProps) => {
    return (
        <div className="row">{
            row.map((col, colIndex) => <Cell key={`${index}-${colIndex}`} value={col} index={index} />)    
        }</div>
    );
}

export default Row;