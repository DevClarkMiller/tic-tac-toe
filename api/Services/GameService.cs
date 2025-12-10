using api.Extensions;
using models;
using models.Game;

namespace api.Services {
    public class GameService : IGameService {
        private Dictionary<string, GameInfo> _games = new();

        private static models.Constants.CellState DEFAULT_CELL_STATE = models.Constants.CellState.Empty;

        public string CreateGame(string username, string sessionId, models.Constants.CellState playerSymbol) {
            while (_games.ContainsKey(sessionId))
                sessionId = Guid.NewGuid().ToString();

            GameInfo game = new() { SessionId = sessionId };
            _games.Add(sessionId, game);
            game.AddPlayer(username, playerSymbol);
            return sessionId;
        }

        public bool JoinGame(string username, string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return false;

            if (game.IsFull() || game.HasPlayer(username)) return false;

            var availableSymbol = game.GetAvailableSymbol();

            game.AddPlayer(username, availableSymbol);
            return true;
        }

        public void LeaveGame(string username, string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null || !game.Players.ContainsKey(username)) return;

            game.Players.Remove(username);
            
            if (game.Players.Count == 0)
                _games.Remove(sessionId);
        }

        public List<string> GetSessionsForUsername(string username) =>
            _games.Where(g => g.Value.Players.ContainsKey(username)).Select(g => g.Key).ToList();

        public models.Constants.CellState MakeMove(string username, string sessionId, int row, int col) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null || !game.Players.ContainsKey(username)) return DEFAULT_CELL_STATE;

            var player = game.GetPlayer(username);

            if (game.Grid[row][col] != models.Constants.CellState.Empty) return DEFAULT_CELL_STATE;

            game.Grid[row][col] = player!.Symbol;

            return player!.Symbol;
        }

        public PlayerInfo? GetPlayerInfo(string username, string sessionId) {
            Console.WriteLine($"Fetching player info for {username}");

            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null || !game.Players.ContainsKey(username)) return null;

            Console.WriteLine("Game exists");

            return game.GetPlayer(username);
        }
    }

    public interface IGameService {
        string CreateGame(string username, string sessionId, models.Constants.CellState playerSymbol);
        bool JoinGame(string username, string sessionId);
        void LeaveGame(string username, string sessionId);
        List<string> GetSessionsForUsername(string username);
        models.Constants.CellState MakeMove(string username, string sessionId, int row, int col);
        PlayerInfo? GetPlayerInfo(string username, string sessionId);
    }
}
