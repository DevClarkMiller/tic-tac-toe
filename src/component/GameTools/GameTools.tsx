import { useContext, useMemo } from "react";

import PlayerSymSelector from "./PlayerSymSelector";
import RefreshButton from "./RefreshButton";
import DifficultySelector from "./DifficultySelector";

// CONTEXT
import { GridContext } from "@context/GridContext";

const GameTools = () => {
    const { game, playerSymbol, setGame, setPlayerSymbol } = useContext(GridContext);

    const gameStarted = useMemo(() => game.GameStarted, [game]);

    return (
        <div className="d-flex mb-2 justify-content-between align-items-center">
            <PlayerSymSelector gameStarted={gameStarted} playerSymbol={playerSymbol} setPlayerSymbol={setPlayerSymbol} />
            <DifficultySelector game={game} setGame={setGame} />
            <RefreshButton game={game} setGame={setGame} />
        </div>
    );
}

export default GameTools;