using System.ComponentModel.DataAnnotations;

namespace Ballista.Domain.Entities
{
    public class WeaponType
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Caliber { get; set; }
        public bool IsApproved { get; set; } // одобрено для использования
        public Guid DisciplineId { get; set; } // к какой дисциплине относится

        // Добавляем навигационное свойство
        public virtual ICollection<ShootingSession> ShootingSessions { get; set; } = new List<ShootingSession>();
    }
}
