import { useMemo, createContext, type ReactNode, useState } from 'react';

// HELPERS
import { CellState, Game } from '../helpers/GameHelper';

export interface GridContextType {
    game: Game;
    onCellClick: (row: number, col: number) => void;
} 

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const GridContextProvider = ({ children }: { children: ReactNode }) => {
    const [game, setGame] = useState<Game>(new Game(3, 3));
    
    const onCellClick = (row: number, col: number) => {
        const newGame = game.Clone();
        newGame.MakeMove(row, col, CellState.Cross);
        setGame(newGame);
    } 
    
    const value = useMemo(() => {
        return  {
            game: game,
            onCellClick: onCellClick
        };
    }, [game, onCellClick]);

    return (
        <GridContext.Provider value={value}>
            {children}
        </GridContext.Provider>
    );
};