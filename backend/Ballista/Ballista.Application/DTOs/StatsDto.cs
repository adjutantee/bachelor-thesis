namespace Ballista.Application.DTOs
{
    public class StatsDto
    {
        public int TotalSessions { get; set; }
        public int TotalShots { get; set; }
        public double AverageAccuracy { get; set; }
        public double BestScore { get; set; }
        public List<DisciplineStatsDto> DisciplineStats { get; set; }
        public List<WeaponStatsDto> WeaponStats { get; set; }
    }
}
