import { useContext, useMemo, useState, type JSX, } from "react";

// CONTEXT
import { GridContext } from "../../context/GridContext";
import Select from "react-select";
import { RxCircle, RxCross1 } from "react-icons/rx";
import { CellState } from "../../helpers/GameHelper";

interface Option {
  value: CellState;
  label: JSX.Element;
}

const PlayerSymSelector = ({ gameStarted, playerSymbol, setPlayerSymbol }: 
    { 
        gameStarted: boolean,
        playerSymbol: CellState,
        setPlayerSymbol: React.Dispatch<React.SetStateAction<CellState>> 
    }) => {
    const options: Option[] = [ { value: CellState.Cross, label: <RxCross1 /> }, { value: CellState.Circle, label: <RxCircle /> } ];

    const [selectedOption, setSelectedOption] = useState<Option>(
        options.find((opt) => opt.value === playerSymbol) ?? options[0]
    );

    const [hasSelected, setHasSelected] = useState(false);
    
    const onSelect = (option: Option | null) => {
        if (hasSelected || !option || gameStarted) return;
        setPlayerSymbol(option.value);
        setSelectedOption(option);
        setHasSelected(true);
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <h3 className="me-2">Player Symbol</h3>
            <Select<Option, false> value={selectedOption} onChange={onSelect} options={options} isSearchable={false}/>
        </div>
    );
}

const GameTools = () => {
    const { game, playerSymbol, setPlayerSymbol } = useContext(GridContext);

    const gameStarted = useMemo(() => game.GameStarted, [game]);
    console.log(gameStarted);

    return (
        <div className="mb-2"><PlayerSymSelector gameStarted={gameStarted} playerSymbol={playerSymbol} setPlayerSymbol={setPlayerSymbol} /></div>
    );
}

export default GameTools;