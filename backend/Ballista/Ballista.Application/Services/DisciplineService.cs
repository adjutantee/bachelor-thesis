using AutoMapper;
using Ballista.Application.DTOs;
using Ballista.Application.Services.Interfaces;
using Ballista.Domain.Entities;
using Ballista.Infrastructure.DbContexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ballista.Application.Services
{
    public class DisciplineService : IDisciplineService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DisciplineService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<DisciplineDto> CreateDisciplineAsync(DisciplineDto disciplineDto)
        {
            var discipline = _mapper.Map<Discipline>(disciplineDto);
            discipline.Id = Guid.NewGuid();

            _context.Disciplines.Add(discipline);
            await _context.SaveChangesAsync();

            return _mapper.Map<DisciplineDto>(discipline);
        }

        public async Task<List<DisciplineDto>> GetAllDisciplinesAsync()
        {
            var disciplines = await _context.Disciplines.ToListAsync();
            return _mapper.Map<List<DisciplineDto>>(disciplines);
        }

        public async Task DeleteDisciplineAsync(Guid disciplineId)
        {
            var discipline = await _context.Disciplines
                .Include(d => d.WeaponTypes)
                .FirstOrDefaultAsync(d => d.Id == disciplineId);

            if (discipline == null)
                throw new KeyNotFoundException("Дисциплина не найдена");

            if (discipline.WeaponTypes.Any())
                throw new InvalidOperationException("Невозможно удалить дисциплину с связанным оружием");

            _context.Disciplines.Remove(discipline);
            await _context.SaveChangesAsync();
        }
    }
}
