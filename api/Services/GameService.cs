using models;

namespace api.Services {
    public class GameService : IGameService {
        public Dictionary<string, GameInfo> Games { get; set; } = new();

        public void CreateGame(string username, string sessionId) {
            GameInfo game = new(sessionId);
        }

        public bool JoinGame(string username, string sessionId) {
            var gameExists = Games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null) return false;

            if (game.PlayerConnectionIds.Count == 2) return false;
            game.PlayerConnectionIds.Add(username);
            return true;
        }

        public void LeaveGame(string username, string sessionId) {
            var gameExists = Games.TryGetValue(sessionId, out var game);
            if (!gameExists || game is null || !game.PlayerConnectionIds.Contains(username)) return;

            game.PlayerConnectionIds.Remove(username);
            
            if (game.PlayerConnectionIds.Count == 0)
                Games.Remove(sessionId);
        }
    }

    public interface IGameService {
        bool JoinGame(string username, string sessionId);
    }
}
