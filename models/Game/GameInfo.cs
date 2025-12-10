namespace models.Game {
    public class GameInfo {
        public required string SessionId { get; set; }
        public Dictionary<string, PlayerInfo> Players { get; } = new();
        public List<List<Constants.CellState>> Grid { get; set; } = new();
    }
}
