using System.ComponentModel.DataAnnotations;

namespace Ballista.Domain.Entities
{
    public class AmmunitionType
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }

        public virtual ICollection<ShootingSession> ShootingSessions { get; set; }
    }
}
