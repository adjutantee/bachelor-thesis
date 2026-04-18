using System.ComponentModel.DataAnnotations.Schema;

namespace Ballista.Domain.Entities
{
    public class ShootingSession
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public Guid UserId { get; set; }
        public Guid DisciplineId { get; set; }
        public Guid WeaponTypeId { get; set; }
        public Guid? AmmunitionTypeId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        [ForeignKey("DisciplineId")]
        public virtual Discipline Discipline { get; set; }
        [ForeignKey("WeaponTypeId")]
        public virtual WeaponType WeaponType { get; set; }
        public virtual ICollection<Shot> Shots { get; set; } = new List<Shot>();
        [NotMapped]
        public double TotalScore => Shots.Sum(s => s.Score);
        public TimeSpan TrainingDuration { get; set; }

        // ExerciseTemplate
        public Guid? ExerciseTemplateId { get; set; }
        public ExerciseTemplate? ExerciseTemplate { get; set; }

    }
}
