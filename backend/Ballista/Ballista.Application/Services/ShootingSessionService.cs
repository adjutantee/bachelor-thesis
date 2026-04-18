using AutoMapper;
using Ballista.Application.DTOs;
using Ballista.Application.Services.Interfaces;
using Ballista.Domain.Entities;
using Ballista.Infrastructure.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ballista.Application.Services
{
    public class ShootingSessionService : IShootingSessionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ShootingSessionService> _logger;

        public ShootingSessionService(ApplicationDbContext context, IMapper mapper, ILogger<ShootingSessionService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        // Получение всех сессий пользователя
        public async Task<List<ShootingSessionViewDto>> GetShootingSessionsByUserIdAsync(Guid userId)
        {
            var sessions = await _context.ShootingSessions
                .Include(s => s.Shots)
                .Include(s => s.Discipline)
                .Include(s => s.WeaponType)
                .Where(s => s.UserId == userId)
                .ToListAsync();

            return _mapper.Map<List<ShootingSessionViewDto>>(sessions);
        }


        // Создание новой сессии
        public async Task<ShootingSessionViewDto> CreateShootingSessionAsync(Guid userId, CreateShootingSessionDto dto)
        {
            var session = _mapper.Map<ShootingSession>(dto);
            session.UserId = userId;
            session.Date = DateTime.UtcNow;

            // Если указан шаблон — загружаем его
            if (dto.ExerciseTemplateId != null)
            {
                var template = await _context.ExerciseTemplates
                    .FirstOrDefaultAsync(t => t.Id == dto.ExerciseTemplateId);

                if (template == null) throw new ArgumentException("Шаблон не найден");

                int required = template.SeriesCount * template.ShotsPerSeries;
                if (dto.Shots.Count != required)
                    throw new InvalidOperationException(
                       $"Template requires exactly {required} shots");

                session.ExerciseTemplateId = template.Id;
            }

            // расчёт очков
            //foreach (var sh in session.Shots)
            //    sh.Score = CalculateScore(sh.X, sh.Y, session.DisciplineId);

            session.Shots = dto.Shots.Select(_mapper.Map<Shot>).ToList();

            _context.ShootingSessions.Add(session);
            await _context.SaveChangesAsync();

            return _mapper.Map<ShootingSessionViewDto>(session);
        }


        // Обновление сессии
        public async Task<CreateShootingSessionDto> UpdateShootingSessionAsync(Guid userId, Guid id, CreateShootingSessionDto sessionDto)
        {
            var existingSession = await _context.ShootingSessions
                .Include(s => s.Shots)
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (existingSession == null)
                throw new KeyNotFoundException("Сессия не найдена или нет доступа");

            // Обновление основных полей, кроме Shots
            _mapper.Map(sessionDto, existingSession);

            // Удаляем старые выстрелы
            _context.Shots.RemoveRange(existingSession.Shots);

            // Добавляем новые выстрелы
            var newShots = sessionDto.Shots.Select(dtoShot =>
            {
                var shot = _mapper.Map<Shot>(dtoShot);
                shot.ShootingSessionId = existingSession.Id;
                return shot;
            }).ToList();

            existingSession.Shots = newShots;

            await _context.SaveChangesAsync();
            return _mapper.Map<CreateShootingSessionDto>(existingSession);
        }

        // Удаление сессии
        public async Task DeleteShootingSessionAsync(Guid userId, Guid id)
        {
            var session = await _context.ShootingSessions
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

            if (session == null)
                throw new KeyNotFoundException("Сессия не найдена или нет доступа");

            _context.ShootingSessions.Remove(session);
            await _context.SaveChangesAsync();
        }

        // Алгоритм расчета очков
        //private int CalculateScore(double x, double y, Guid disciplineId)
        //{
        //    double distance = Math.Sqrt(x * x + y * y);

        //    return distance switch
        //    {
        //        <= 0.5 => 10,  // Яблочко
        //        <= 1.0 => 9,
        //        <= 1.5 => 8,
        //        <= 2.0 => 7,
        //        <= 2.5 => 6,
        //        <= 3.0 => 5,
        //        <= 3.5 => 4,
        //        <= 4.0 => 3,
        //        <= 4.5 => 2,
        //        <= 5.0 => 1,
        //        _ => 0
        //    };
        //}
    }
}
