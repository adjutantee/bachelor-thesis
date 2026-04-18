using System.ComponentModel.DataAnnotations;

namespace Ballista.Domain.Entities
{
    public enum FriendshipStatus
    {
        Pending,   // Запрос отправлен, ожидает подтверждения
        Accepted,  // Запрос принят
        Rejected   // Запрос отклонен
    }

    public class Friendship
    {
        [Key]
        //public Guid Id { get; set; }
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }
        public User User { get; set; } // Тот, кто отправил запрос

        public Guid FriendId { get; set; }
        public User Friend { get; set; } // Тот, кому отправлен запрос

        public FriendshipStatus Status { get; set; } = FriendshipStatus.Pending;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
