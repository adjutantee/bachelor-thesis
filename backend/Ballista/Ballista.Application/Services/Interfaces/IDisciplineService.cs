using Ballista.Application.DTOs;

namespace Ballista.Application.Services.Interfaces
{
    public interface IDisciplineService
    {
        Task<List<DisciplineDto>> GetAllDisciplinesAsync();
        Task<DisciplineDto> CreateDisciplineAsync(DisciplineDto disciplineDto);
        Task DeleteDisciplineAsync(Guid disciplineId);
    }
}
