using Ballista.Application.DTOs;

namespace Ballista.Application.Services.Interfaces
{
    public interface IShootingSessionService
    {
        Task<List<ShootingSessionViewDto>> GetShootingSessionsByUserIdAsync(Guid userId);
        Task<ShootingSessionViewDto> CreateShootingSessionAsync(Guid userId, CreateShootingSessionDto sessionDto);
        Task<CreateShootingSessionDto> UpdateShootingSessionAsync(Guid userId, Guid id, CreateShootingSessionDto sessionDto);
        Task DeleteShootingSessionAsync(Guid userId, Guid id);
    }
}
