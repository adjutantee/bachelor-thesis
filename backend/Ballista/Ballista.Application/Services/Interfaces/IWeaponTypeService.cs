using Ballista.Application.DTOs;

namespace Ballista.Application.Services.Interfaces
{
    public interface IWeaponTypeService
    {
        Task<List<WeaponTypeDto>> GetAllWeaponsAsync();
        Task<List<WeaponTypeDto>> GetWeaponsByDisciplineAsync(Guid disciplineId);
        Task<WeaponTypeDto> CreateWeaponTypeAsync(WeaponTypeDto weaponDto);
        Task DeleteWeaponTypeAsync(Guid weaponTypeId);
    }
}
