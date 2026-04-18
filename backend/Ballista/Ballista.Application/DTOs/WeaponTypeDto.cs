using System.ComponentModel.DataAnnotations;

namespace Ballista.Application.DTOs
{
    public class WeaponTypeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Caliber { get; set; }
        public Guid DisciplineId { get; set; }
    }
}
