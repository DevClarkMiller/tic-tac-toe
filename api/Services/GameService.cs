using models;

namespace api.Services {
    public class GameService : IGameService {
        private Dictionary<string, GameInfo> _games = new();

        public void CreateGame(string username, string sessionId) {
            GameInfo game = new(sessionId);
        }

        public bool JoinGame(string username, string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return false;

            if (game.PlayerConnectionIds.Count == 2) return false;
            game.PlayerConnectionIds.Add(username);
            return true;
        }

        public void LeaveGame(string username, string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null || !game.PlayerConnectionIds.Contains(username)) return;

            game.PlayerConnectionIds.Remove(username);
            
            if (game.PlayerConnectionIds.Count == 0)
                _games.Remove(sessionId);
        }
    }

    public interface IGameService {
        void CreateGame(string username, string sessionId);
        bool JoinGame(string username, string sessionId);
        void LeaveGame(string username, string sessionId);
    }
}
