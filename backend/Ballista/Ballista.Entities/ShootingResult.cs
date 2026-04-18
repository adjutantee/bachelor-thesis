namespace Ballista.Entities
{
    public class ShootingResult
    {
        public int Id { get; set; }          // Уникальный идентификатор результата
        public int UserId { get; set; }      // Идентификатор пользователя, связанного с результатом
        public DateTime Date { get; set; }   // Дата тренировки
        public string WeaponType { get; set; } // Тип оружия, использованного во время тренировки
        public string AmmunitionType { get; set; } // Тип патрона, использованного во время тренировки
        public double Distance { get; set; }  // Расстояние до цели
        public int ShotsFired { get; set; }   // Количество выстрелов
        public int Hits { get; set; }          // Количество попаданий

        public double CalculateAccuracy()
        {
            return ShotsFired > 0 ? (double)Hits / ShotsFired * 100 : 0;
        }
    }
}
