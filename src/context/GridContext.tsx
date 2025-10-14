import { useMemo, createContext, type ReactNode, useState } from 'react';

// HELPERS
import { Game } from '../helpers/GameHelper';
import { determineMove } from '../helpers/GameTheoryHelper';

export interface GridContextType {
    game: Game;
    onCellClick: (row: number, col: number) => void;
} 

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const GridContextProvider = ({ children }: { children: ReactNode }) => {
    const [game, setGame] = useState<Game>(new Game(3, 3));

    const makeMove = (row: number, col: number, gameToMakeMove: Game) => {
        const newGame = gameToMakeMove.Clone();
        newGame.MakeMove({ x: col, y: row });
        setGame(newGame);
        return newGame;
    }
    
    const onCellClick = async (row: number, col: number) => {
        const updatedGame = makeMove(row, col, game);
        
        // Now await the ais response
        const aiMove = await determineMove(updatedGame);
        if (aiMove != null) makeMove(aiMove.y, aiMove.x, updatedGame);
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