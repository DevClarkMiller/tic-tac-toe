import { useMemo, createContext, type ReactNode, useState } from 'react';

// HELPERS
import { createGrid } from '../helpers/GridHelper';

export interface GridContextType {
    grid: number[][];
    onCellClick: (row: number, col: number) => void;
} 

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const GridContextProvider = ({ children }: { children: ReactNode }) => {
    const [grid, setGrid] = useState<number[][]>(createGrid(3, 3));
    
    const onCellClick = (row: number, col: number) => {
        const gridCpy = [...grid];
        gridCpy[row][col] = 0;
        setGrid(gridCpy);
    } 
    
    const value = useMemo(() => {
        return  {
            grid: grid,
            onCellClick: onCellClick
        };
    }, [grid, onCellClick]);

    return (
        <GridContext.Provider value={value}>
            {children}
        </GridContext.Provider>
    );
};