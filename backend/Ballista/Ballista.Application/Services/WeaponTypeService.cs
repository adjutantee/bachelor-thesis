using AutoMapper;
using Ballista.Application.DTOs;
using Ballista.Application.Services.Interfaces;
using Ballista.Domain.Entities;
using Ballista.Infrastructure.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Ballista.Application.Services
{
    public class WeaponTypeService : IWeaponTypeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public WeaponTypeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<WeaponTypeDto>> GetAllWeaponsAsync()
        {
            var weapon = await _context.WeaponTypes.ToListAsync();

            return _mapper.Map<List<WeaponTypeDto>>(weapon);
        }

        public async Task<List<WeaponTypeDto>> GetWeaponsByDisciplineAsync(Guid disciplineId)
        {
            var weapons = await _context.WeaponTypes
                .Where(w => w.DisciplineId == disciplineId)
                .ToListAsync();

            return _mapper.Map<List<WeaponTypeDto>>(weapons);
        }

        public async Task<WeaponTypeDto> CreateWeaponTypeAsync(WeaponTypeDto weaponDto)
        {
            var weapon = _mapper.Map<WeaponType>(weaponDto);
            weapon.Id = Guid.NewGuid();

            _context.WeaponTypes.Add(weapon);
            await _context.SaveChangesAsync();

            return _mapper.Map<WeaponTypeDto>(weapon);
        }

        public async Task DeleteWeaponTypeAsync(Guid weaponTypeId)
        {
            var weapon = await _context.WeaponTypes
                .Include(w => w.ShootingSessions)
                .FirstOrDefaultAsync(w => w.Id == weaponTypeId);

            if (weapon == null)
                throw new KeyNotFoundException("Тип оружия не найден");

            if (weapon.ShootingSessions.Any())
                throw new InvalidOperationException("Нельзя удалить тип оружия с связанными сессиями");

            _context.WeaponTypes.Remove(weapon);
            await _context.SaveChangesAsync();
        }                
    }
}
