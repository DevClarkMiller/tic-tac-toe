using api.Services;
using Microsoft.AspNetCore.SignalR;

namespace api.Hubs {
    public class ChatHub(IGameService gameService) : Hub {
        private readonly IGameService _gameService = gameService;

        public async Task<string> CreateSession() {
            string sessionId = Guid.NewGuid().ToString();
            await JoinSession(sessionId);
            return _gameService.CreateGame(Context.ConnectionId, sessionId);
        }

        public async Task<bool> JoinSession(string sessionId) {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
            return _gameService.JoinGame(Context.ConnectionId, sessionId);
        }

        public async Task LeaveSession(string sessionId) {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
            _gameService.JoinGame(Context.ConnectionId, sessionId);
        }

        public async Task SendMessage(string username, string message, string sessionId) {
            await Clients.Group(sessionId).SendAsync("ReceiveMessage", username, message);
        }
    }
}
