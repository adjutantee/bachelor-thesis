using Ballista.Application.DTOs;

namespace Ballista.Application.Services.Interfaces
{
    public interface IFriendshipService
    {
        Task SendRequestAsync(Guid userId, Guid friendId);
        Task AcceptRequestAsync(Guid friendshipId);
        Task RejectRequestAsync(Guid friendshipId);
        Task RemoveFriendAsync(Guid userId, Guid friendId);
        Task<List<FriendshipDto>> GetFriendsAsync(Guid userId);
    }
}
