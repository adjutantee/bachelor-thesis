using Ballista.Domain.Entities;

namespace Ballista.Application.Services.Interfaces
{
    public interface IAuthenticationService
    {
        Task<string> GenerateJwtTokenByUser(User user);
        string GenerateRefreshToken();
    }
}
