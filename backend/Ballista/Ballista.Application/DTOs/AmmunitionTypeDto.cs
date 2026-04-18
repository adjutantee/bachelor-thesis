using System.ComponentModel.DataAnnotations;

namespace Ballista.Application.DTOs
{
    public class AmmunitionTypeDto
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
