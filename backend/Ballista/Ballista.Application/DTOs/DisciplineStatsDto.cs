namespace Ballista.Application.DTOs
{
    public class DisciplineStatsDto
    {
        public Guid DisciplineId { get; set; }
        public string Name { get; set; }
        public int SessionsCount { get; set; }
        public double AverageScore { get; set; }
    }
}
