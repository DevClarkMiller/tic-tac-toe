namespace models {
    public class GameInfo {
        public string SessionId { get; set; }
        public HashSet<string> PlayerConnectionIds { get; } = new();

        public GameInfo(string sessionId) {
            SessionId = sessionId;
        }
    }
}
