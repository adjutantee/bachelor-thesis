using Microsoft.AspNetCore.Identity;

namespace Ballista.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public DateTime? LastLoginDate { get; set; }

        // Список дружб, которые пользователь инициировал
        public List<Friendship>? Friendships { get; set; } = new List<Friendship>();

        // Список дружб, где пользователь является другом
        public List<Friendship>? FriendOf { get; set; } = new List<Friendship>();

        // Список тренировок по стрельбе
        public List<ShootingSession>? ShootingSessions { get; set; } = new List<ShootingSession>();
    }
}
