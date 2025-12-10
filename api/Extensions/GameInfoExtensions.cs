using models;
using models.Game;

namespace api.Extensions {
    public static class GameInfoExtensions {
        public static void AddPlayer(this GameInfo game, string username, models.Constants.CellState playerSymbol) {
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

        public static models.Constants.CellState GetAvailableSymbol(this GameInfo game) =>
            game.Players.Values.Any(p => p.Symbol == models.Constants.CellState.Cross)
                ? models.Constants.CellState.Circle
                : models.Constants.CellState.Cross;

        public static void InitGrid(this GameInfo game) {
            game.Grid = Enumerable.Range(0, Constants.GRID_ROW_CNT)
                .Select(_ => Enumerable.Repeat(models.Constants.CellState.Empty, Constants.GRID_COL_CNT).ToList())
                .ToList();
        }

        public static models.Constants.CellState GameWinner() => models.Constants.CellState.Empty; // Return the empty cell state for now until logic for determining winnder
    }
}
