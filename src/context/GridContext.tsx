import { useMemo, createContext, type ReactNode } from 'react';

// HELPERS
import { createGrid } from '../helpers/GridHelper';

export interface GridContextType {
    grid: number[][];
} 

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const GridContextProvider = ({ children }: { children: ReactNode }) => {
    const value = useMemo(() => {
        return  {
            grid: createGrid(3, 3)
        };
    }, []);

    return (
        <GridContext.Provider value={value}>
            {children}
        </GridContext.Provider>
    );
};