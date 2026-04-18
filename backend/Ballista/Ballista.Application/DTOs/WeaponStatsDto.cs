namespace Ballista.Application.DTOs
{
    public class WeaponStatsDto
    {
        public Guid WeaponTypeId { get; set; }
        public string Name { get; set; }
        public int SessionsCount { get; set; }
        public double AverageScore { get; set; }
    }
}
