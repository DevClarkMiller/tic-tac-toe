/* eslint-disable no-unused-vars */
export enum CellState {
	Empty = -1,
	Cross,
	Circle,
}

export const cellStateName = (val: CellState) => {
	switch (val) {
		case CellState.Empty:
			return 'Empty';
		case CellState.Circle:
			return 'Circle';
		case CellState.Cross:
			return 'Cross';
	}
};
