using api.Extensions;
using models.Game;

using CellState = models.Constants.CellState;

namespace api.Services {
    public class GameService : IGameService {
        private Dictionary<string, GameInfo> _games = new();

        private static CellState DEFAULT_CELL_STATE = CellState.Empty;

        public string CreateGame(string username, string sessionId, CellState playerSymbol) {
            while (_games.ContainsKey(sessionId))
                sessionId = Guid.NewGuid().ToString();

            GameInfo game = new() { SessionId = sessionId };
            game.InitGrid();
            game.ActivePlayer = playerSymbol;
            _games.Add(sessionId, game);
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

        public CellState MakeMove(string username, string sessionId, int row, int col) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (
                !gameExists ||
                game is null ||
                !game.Players.ContainsKey(username) ||
                !game.HasStarted()
                ) return DEFAULT_CELL_STATE;

            var player = game.GetPlayer(username)!;
            if (player.Symbol != game.ActivePlayer) return DEFAULT_CELL_STATE;

            if (game.Grid[row][col] != CellState.Empty) return DEFAULT_CELL_STATE;

            game.Grid[row][col] = player!.Symbol;

            game.SwapActivePlayer();
            return player!.Symbol;
        }

        public PlayerInfo? GetPlayerInfo(string username, string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null || !game.Players.ContainsKey(username)) return null;

            return game.GetPlayer(username);
        }

        public CellState GetActivePlayer(string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return CellState.Empty;

            return game.ActivePlayer;
        }

        public bool IsGameOver(string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return true;

            return game.CheckForEnd();
        }

        public CellState GetGameWinner(string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return CellState.Empty;

            return game.CalculateWinner(game.ActivePlayer);
        }

        public void RestartGame(string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return;

            game.InitGrid();
            game.ActivePlayer = game.Players.First().Value.Symbol;
        }
    }

    public interface IGameService {
        string CreateGame(string username, string sessionId, CellState playerSymbol);
        bool JoinGame(string username, string sessionId);
        void LeaveGame(string username, string sessionId);
        List<string> GetSessionsForUsername(string username);
        CellState MakeMove(string username, string sessionId, int row, int col);
        PlayerInfo? GetPlayerInfo(string username, string sessionId);
        CellState GetActivePlayer(string sessionId);
        bool IsGameOver(string sessionId);
        CellState GetGameWinner(string sessionId);
        void RestartGame(string sessionId);
    }
}
