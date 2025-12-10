using api.Services;
using Microsoft.AspNetCore.SignalR;
using models;
using models.Game;

// TODO: SEPERATE LOGIC INTO DIFFERENT HUBS, THEN MAKE THAT MODULAR ON THE CLIENT

namespace api.Hubs {
    public class ChatHub(IGameService gameService) : Hub {
        private readonly IGameService _gameService = gameService;

        public async Task<string> CreateSession(models.Constants.CellState playerSymbol) {
            string sessionId = Guid.NewGuid().ToString();
            await JoinSession(sessionId);
            return _gameService.CreateGame(Context.ConnectionId, sessionId, playerSymbol);
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

        public async Task SendGameMove(string sessionId, int row, int column) {
            var symbol = _gameService.MakeMove(Context.ConnectionId, sessionId, row, column);
            await Clients.Group(sessionId).SendAsync("ReceiveGameMove", row, column, symbol);
        }

        public PlayerInfo? GetPlayerInfo(string sessionId) => _gameService.GetPlayerInfo(Context.ConnectionId, sessionId);

        public override async Task OnDisconnectedAsync(Exception? exception) {
            // Use Context.ConnectionId to identify the user
            string connectionId = Context.ConnectionId;

            // Example: Remove user from any games they were in
            foreach (var sessionId in _gameService.GetSessionsForUsername(connectionId)) {
                _gameService.LeaveGame(connectionId, sessionId);

                // Optionally notify other users in the session
                await Clients.Group(sessionId)
                             .SendAsync("PlayerLeft", connectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
