using Microsoft.AspNetCore.SignalR;

namespace api.Hubs {
    public class ChatHub : Hub {
        public async Task<string> CreateSession() {
            string sessionId = Guid.NewGuid().ToString();
            await JoinSession(sessionId);
            return sessionId;
        }

        public async Task JoinSession(string sessionId) {
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        }

        public async Task LeaveSession(string sessionId) {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);
        }

        public async Task SendMessage(string user, string message, string sessionId) {
            await Clients.Group(sessionId).SendAsync("ReceiveMessage", user, message);
        }
    }
}
