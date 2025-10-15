import { useMemo, createContext, type ReactNode, useState, useEffect } from 'react';

// HELPERS
import { CellState, cellStateName, Game, isPlayer } from '../helpers/GameHelper';
import { determineMove } from '../helpers/GameTheoryHelper';

export interface GridContextType {
    game: Game;
    playerSymbol: CellState;
    setPlayerSymbol: React.Dispatch<React.SetStateAction<CellState>>;
    onCellClick: (row: number, col: number) => void;
} 

export const GridContext = createContext<GridContextType>({} as GridContextType);

export const GridContextProvider = ({ children }: { children: ReactNode }) => {
    const [game, setGame] = useState<Game>(new Game(3, 3));
    const [playerSymbol, setPlayerSymbol] = useState<CellState>(CellState.Cross);

    const makeMove = (row: number, col: number, baseGame?: Game): Game => {
        // Always operate from a fresh clone (either passed in or current state)
        const gameToUpdate = (baseGame ?? game).Clone();
        gameToUpdate.MakeMove({ x: col, y: row });
        setGame(gameToUpdate);
        return gameToUpdate;
    };

    const onCellClick = async (row: number, col: number) => {
        // Player move
        let currentGame = game.Clone();
        currentGame.GameStarted = true;
        currentGame = makeMove(row, col, currentGame);

        // AI move after the player
        const aiMove = await determineMove(currentGame);
        if (aiMove) makeMove(aiMove.y, aiMove.x, currentGame);
    };

    useEffect(() => { 
        if (game?.IsGameOver) {
            const winner = game.CalculateScoreAndWinner(game.ActivePlayer).winner;
            let msg = '';
            if (winner !== null) msg = `${cellStateName(winner as CellState)} won the game!`;
            else msg = 'A cats game, nobody won!';

            alert(msg);
        }
    }, [game?.IsGameOver]);
    
    const value = useMemo(() => {
        return  { game, playerSymbol, setPlayerSymbol, onCellClick };
    }, [game, onCellClick]);

    return (
        <GridContext.Provider value={value}>
            {children}
        </GridContext.Provider>
    );
};