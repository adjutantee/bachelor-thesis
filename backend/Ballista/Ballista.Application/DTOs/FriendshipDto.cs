using Ballista.Domain.Entities;

namespace Ballista.Application.DTOs
{
    public class FriendshipDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string FriendName { get; set; } 
        public Guid UserId { get; set; }
        public Guid FriendId { get; set; }
        public FriendshipStatus Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
