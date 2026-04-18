namespace Ballista.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public List<ShootingResult> ShootingResults { get; set; } // Результаты стрельбы, связанные с пользователем

        public User()
        {
            ShootingResults = new List<ShootingResult>();
        }
    }
}
