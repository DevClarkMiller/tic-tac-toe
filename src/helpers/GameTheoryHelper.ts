import { CellState, Game, Coord } from "./GameHelper";

export const evaluate = () => {

};

export interface MinMaxResult {
    move: Coord;
    eval: number;
}

export const minmax = (game: Game, depth: number, maximizingPlayer: unknown, maximizingSym: CellState): MinMaxResult => {
    // if (depth == 0 || game.IsGameOver) TODO: IMPLEMENT THIS

    const possibleMoves = game.GetPossibleMoves();

    if (possibleMoves.size == 0) // TODO: IMPLEMENT THIS


    // if (maximizingPlayer) {
    //     let maxEval = Number.NEGATIVE_INFINITY;

    //     possibleMoves.forEach(move => {
    //     });
    // } else {
    //     let minEval = Number.POSITIVE_INFINITY;

    //     possibleMoves.forEach(move => {
    //     });
    // }
};