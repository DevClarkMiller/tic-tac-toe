import { Game } from "@game/Game";
import type GameProp from "types/GameProp";

// ICONS
import { IoIosRefresh } from "react-icons/io";

const RefreshButton = ({ game, setGame }: GameProp) => {
    const onClick = () => {
        setGame(new Game(game.Rows, game.Cols));
    };

    return (
        <button onClick={onClick} className="btn-icon btn bg-transparent fs-2 d-flex align-content-center icon-link-hover">
            <IoIosRefresh />
        </button>
    );
}

export default RefreshButton;