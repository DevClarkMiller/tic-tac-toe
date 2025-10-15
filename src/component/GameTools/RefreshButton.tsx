import { Game } from "@game/Game";
import type GameProp from "types/GameProp";
import { CellState } from "@game/CellState";

// ICONS
import { IoIosRefresh } from "react-icons/io";

export interface RefreshButtonProps extends GameProp {
    playerSymbol: CellState;
}

const RefreshButton = ({ playerSymbol, game, setGame }: RefreshButtonProps) => {
    const onClick = () => {
        const newGame = new Game(game.Rows, game.Cols);
        newGame.ActivePlayer = playerSymbol;
        setGame(newGame);
    };

    return (
        <button onClick={onClick} className="btn-icon btn bg-transparent fs-2 d-flex align-content-center icon-link-hover">
            <IoIosRefresh />
        </button>
    );
}

export default RefreshButton;