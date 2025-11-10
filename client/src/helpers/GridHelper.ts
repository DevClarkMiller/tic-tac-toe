export const createGrid = <T>(
	nRows: number,
	nCols: number,
	defaultValue: T,
): T[][] => {
	return Array.from({ length: nRows }, () =>
		Array.from({ length: nCols }, () => defaultValue),
	);
};
