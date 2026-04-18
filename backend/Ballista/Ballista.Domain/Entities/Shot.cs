namespace Ballista.Domain.Entities
{
    public class Shot
    {
        public Guid Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Score { get; set; }

        public Guid ShootingSessionId { get; set; }
        public virtual ShootingSession ShootingSession { get; set; }
    }
}
