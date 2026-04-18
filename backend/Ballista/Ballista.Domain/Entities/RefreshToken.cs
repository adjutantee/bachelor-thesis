using System.ComponentModel.DataAnnotations;

namespace Ballista.Domain.Entities
{
    public class RefreshToken
    {
        [Key]
        public Guid Id { get; set; }
        public string Token { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
    }
}
