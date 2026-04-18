namespace Ballista.Domain.Entities
{
    public class Discipline
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double TargetDiameter { get; set; } // в мм
        public double Distance { get; set; } // в метрах

        public virtual ICollection<WeaponType> WeaponTypes { get; set; } = new List<WeaponType>();
    }
}
