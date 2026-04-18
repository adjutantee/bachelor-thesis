namespace Ballista.Application.DTOs
{
    public class ShootingSessionViewDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public string Discipline { get; set; }
        public string WeaponType { get; set; }
        public List<ShotDto> Shots { get; set; }
        public double TotalScore { get; set; }
        public TimeSpan TrainingDuration { get; set; }
    }
}
