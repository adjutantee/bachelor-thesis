using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ballista.Application.DTOs
{
    public class CreateShootingSessionDto
    {
        public Guid DisciplineId { get; set; }
        public Guid WeaponTypeId { get; set; }
        public List<ShotDto> Shots { get; set; } = new();


        // ExerciseTemplate
        public Guid? ExerciseTemplateId { get; set; }
        public TimeSpan TrainingDuration { get; set; }
    }
}
