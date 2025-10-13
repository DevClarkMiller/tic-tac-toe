export const createGrid = (nRows: number, nCols: number): number[][] => {
    return Array.from({ length: nRows}, () => 
        Array.from({ length: nCols }, () => -1)
    );
};