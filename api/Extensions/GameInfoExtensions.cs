using models;
using models.Game;

namespace api.Extensions {
    public static class GameInfoExtensions {
        public static void AddPlayer(this GameInfo game, string username, Constants.CellState playerSymbol) {
            game.Players.Add(username, new PlayerInfo() { Symbol = playerSymbol });
        }

        public static bool HasPlayer(this GameInfo game, string username) =>
            game.Players.ContainsKey(username);

        public static int PlayerCount(this GameInfo game) =>
            game.Players.Count;

        public static bool IsFull(this GameInfo game) =>
            game.Players.Count >= 2;

        public static Constants.CellState GetAvailableSymbol(this GameInfo game) =>
            game.Players.Values.Any(p => p.Symbol == Constants.CellState.Cross)
                ? Constants.CellState.Circle
                : Constants.CellState.Cross;
    }
}
