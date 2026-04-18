using Ballista.Application.DTOs;

namespace Ballista.Application.Services.Interfaces
{
    public interface IStatsService
    {
        Task<StatsDto> GetUserStats(Guid userId);
        Task<List<HeatmapPointDto>> GetHeatmapData(Guid userId);
    }
}
