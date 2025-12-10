using System.Numerics;

namespace api {
    public static class Constants {
        public const int GridColCnt = 3;
        public const int GridRowCnt = 3;
        public const int NumCellsAlignedToWin = 3;
        public const int CellCheckRange = 2;

        public static readonly List<List<List<int>>> DirsWithCompliments = [
            [
                [1, 0],
                [-1, 0],
            ],
            [
                [0, 1],
                [0, -1],
            ],
            [
                [1, 1],
                [-1, -1],
            ],
            [
                [-1, 1],
                [1, -1],
            ],
        ];
    }
}
