import { CellState } from "@game/CellState";

export const isPlayer = (val: CellState) => {
    return val != CellState.Empty;
}

export const getOppositePlayer = (player: CellState) => {
    if (player == CellState.Cross) return CellState.Circle;
    return CellState.Cross;
};

export const DIRS_WITH_COMPLIMENTS = [
    [[1, 0], [-1, 0]],
    [[0, 1], [0, -1]],
    [[1, 1], [-1, -1]],
    [[-1, 1], [1, -1]]
];

export { CellState };
