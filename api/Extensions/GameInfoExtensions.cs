using Microsoft.AspNetCore.Mvc.Diagnostics;
using models.Game;
using CellState = models.Constants.CellState;

namespace api.Extensions {
    public static class GameInfoExtensions {
        public static void AddPlayer(this GameInfo game, string username, CellState playerSymbol) {
            game.Players.Add(username, new PlayerInfo() { Symbol = playerSymbol });
        }

        public static bool HasPlayer(this GameInfo game, string username) =>
            game.Players.ContainsKey(username);

        public static PlayerInfo? GetPlayer(this GameInfo game, string username) =>
            game.Players.TryGetValue(username, out var player) ? player : null;

        public static int PlayerCount(this GameInfo game) =>
            game.Players.Count;

        public static bool IsFull(this GameInfo game) =>
            game.Players.Count >= 2;

        public static CellState GetAvailableSymbol(this GameInfo game) =>
            game.Players.Values.Any(p => p.Symbol == CellState.Cross)
                ? CellState.Circle
                : CellState.Cross;

        public static void InitGrid(this GameInfo game) {
            game.Grid = Enumerable.Range(0, Constants.GridRowCnt)
                .Select(_ => Enumerable.Repeat(CellState.Empty, Constants.GridColCnt).ToList())
                .ToList();
        }

        public static bool HasStarted(this GameInfo game) => game.PlayerCount() == 2;

        public static int NumAlignedCells(this GameInfo game, int r, int c, int cMod, int rMod, models.Constants.CellState cell) {
            int matchCnt = 0;

            r += rMod;
            c += cMod;

            for (int i = 0; i < Constants.CellCheckRange; i++) {
                // stop if out of bounds
                if (c < 0 || c >= Constants.GridColCnt || r < 0 || r >= Constants.GridRowCnt) break;

                // count if matching, else stop
                if (game.Grid[r][c] == cell) matchCnt++;
                else break;

                // move again in the same direction
                c += cMod;
                r += rMod;
            }

            return matchCnt;
        }

        public static bool CheckCellWin(this GameInfo game, int r, int c) {
            var cell = game.Grid[r][c];
            if (cell == CellState.Empty) return false;
            // CHECK EACH DIRECTION BY THE GIVEN RANGE

            foreach (var dirWithCompliment in Constants.DirsWithCompliments) {
                int alignedCnt = 1;
                foreach (var dir in dirWithCompliment) {
                    alignedCnt += game.NumAlignedCells(r, c, dir[0], dir[1], cell);
                }

                if (alignedCnt >= Constants.NumCellsAlignedToWin) return true;
            }

            return false;
        }

        public static List<List<int>> GetPossibleMoves(this GameInfo game) {
            List<List<int>> moves = [];

            for (int r = 0; r < Constants.GridRowCnt; r++) {
                for (int c = 0; c < Constants.GridColCnt; c++) {
                    if (game.Grid[r][c] == CellState.Empty) moves.Add([c, r]);
                }
            }

            return moves;
        }

        public static bool CheckForEnd(this GameInfo game) {
            // Check each direction for a win, if win game over
            for (int r = 0; r < Constants.GridRowCnt; r++) {
                for (int c = 0; c < Constants.GridColCnt; c++) { 
                    if (game.CheckCellWin(r, c)) return true;
                }
            }

            // If the number of possible moves is 0 and there's no winner, game over
            return game.GetPossibleMoves().Count == 0;
        }
        public static CellState CalculateWinner(this GameInfo game, CellState maximizer) {
            // Loop through each cell
            for (int r = 0; r < Constants.GridRowCnt; r++) {
                for (int c = 0; c < Constants.GridColCnt; c++) {
                    var cell = game.Grid[r][c];
                    if (cell == CellState.Empty) continue;

                    // Check all directions (horizontal, vertical, diagonals)
                    foreach (var dirWithCompliment in Constants.DirsWithCompliments) {
                        int alignedCnt = 1;
                        foreach (var dir in dirWithCompliment) {
                            alignedCnt += game.NumAlignedCells(r, c, dir[0], dir[1], cell);
                        }

                        if (alignedCnt >= Constants.NumCellsAlignedToWin) {
                            // Terminal win/loss
                            return cell;
                        }
                    }
                }
            }

            return CellState.Empty;
        }

        public static void SwapActivePlayer(this GameInfo game) {
            game.ActivePlayer = game.ActivePlayer == CellState.Cross ? CellState.Circle : CellState.Cross;
        }
    }
}
