import { CellState, Game, Coord } from "./GameHelper";

export const evaluate = (game: Game, maximizingSym: CellState) => {
    const score = game.CalculateScoreAndWinner(maximizingSym).score;
    return score;
};

export interface MinMaxResult {
    move: Coord | null;
    eval: number;
}

export const minmax = (game: Game, depth: number, maximizingPlayer: boolean, maximizingSym: CellState): MinMaxResult => {
    if (depth === 0 || game.IsGameOver)
        return { move: null, eval: evaluate(game, maximizingSym) };

    const possibleMoves = game.GetPossibleMoves();

    if (possibleMoves.size === 0)
        return { move: null, eval: evaluate(game, maximizingSym) };

    let bestMove: Coord | null = null;

    if (maximizingPlayer) {
        let maxEval = Number.NEGATIVE_INFINITY;

        for (const move of possibleMoves) {
            let memento = game.GetState();
            game.MakeMove(move);
            const currEval = minmax(game, depth - 1, false, maximizingSym).eval;
            game.SetState(memento);
            if (currEval > maxEval) {
                maxEval = currEval;
                bestMove = move;
            }
        }

        return { move: bestMove, eval: maxEval };
    } else {
        let minEval = Number.POSITIVE_INFINITY;

        for (const move of possibleMoves) {
            let memento = game.GetState();
            game.MakeMove(move);
            const currEval = minmax(game, depth - 1, true, maximizingSym).eval;
            game.SetState(memento);
            if (currEval < minEval) {
                minEval = currEval;
                bestMove = move;
            }
        }

        return { move: bestMove, eval: minEval };
    }
};

export const determineMove = (game: Game): Promise<Coord | null> => {
  const DEPTH = 3;
  return new Promise(resolve => {
    setTimeout(() => {
      const value = minmax(game.Clone(), DEPTH, true, CellState.Circle);
      resolve(value.move);
    }, 0);
  });
};