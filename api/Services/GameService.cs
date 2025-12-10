using models;

namespace api.Services {
    public class GameService : IGameService {
        private Dictionary<string, GameInfo> _games = new();

        public string CreateGame(string username, string sessionId) {
            while (_games.ContainsKey(sessionId))
                sessionId = Guid.NewGuid().ToString();

            GameInfo game = new(sessionId);
            _games.Add(sessionId, game);
            return sessionId;
        }

        public bool JoinGame(string username, string sessionId) {
            var gameExists = _games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return false;

            Console.WriteLine($"{username} is requesting to join {sessionId}");
            if (game.PlayerConnectionIds.Count == 2 || game.PlayerConnectionIds.Contains(username)) return false;
            game.PlayerConnectionIds.Add(username);
            Console.Write($"{username} successfully joined {sessionId}");
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
        string CreateGame(string username, string sessionId);
        bool JoinGame(string username, string sessionId);
        void LeaveGame(string username, string sessionId);
    }
}
