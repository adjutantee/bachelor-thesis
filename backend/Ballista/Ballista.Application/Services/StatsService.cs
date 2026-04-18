using Ballista.Application.DTOs;
using Ballista.Application.Services.Interfaces;
using Ballista.Infrastructure.DbContexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ballista.Application.Services
{
    public class StatsService : IStatsService
    {
        private readonly ApplicationDbContext _context;

        public StatsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<HeatmapPointDto>> GetHeatmapData(Guid userId)
        {
            return await _context.Shots
                .Where(s => s.ShootingSession.UserId == userId)
                .Select(s => new HeatmapPointDto
                {
                    X = s.X,
                    Y = s.Y,
                    Score = (int)s.Score
                })
                .ToListAsync();
        }

        public async Task<StatsDto> GetUserStats(Guid userId)
        {
            var sessions = await _context.ShootingSessions
                .Include(s => s.Shots)
                .Include(s => s.Discipline)
                .Include(s => s.WeaponType)
                .Where(s => s.UserId == userId)
                .ToListAsync();

            var allShots = sessions.SelectMany(s => s.Shots).ToList();

            var stats = new StatsDto
            {
                TotalSessions = sessions.Count,
                TotalShots = allShots.Count,
                AverageAccuracy = allShots.Any() ? allShots.Average(s => s.Score) : 0,
                BestScore = allShots.Any() ? allShots.Max(s => s.Score) : 0,
                DisciplineStats = sessions
                    .GroupBy(s => s.Discipline)
                    .Select(g => new DisciplineStatsDto
                    {
                        DisciplineId = g.Key.Id,
                        Name = g.Key.Name,
                        SessionsCount = g.Count(),
                        AverageScore = g.SelectMany(s => s.Shots).Any()
                            ? g.SelectMany(s => s.Shots).Average(sh => sh.Score)
                            : 0
                    }).ToList(),
                WeaponStats = sessions
                    .GroupBy(s => s.WeaponType)
                    .Select(g => new WeaponStatsDto
                    {
                        WeaponTypeId = g.Key.Id,
                        Name = g.Key.Name,
                        SessionsCount = g.Count(),
                        AverageScore = g.SelectMany(s => s.Shots).Any()
                            ? g.SelectMany(s => s.Shots).Average(sh => sh.Score)
                            : 0
                    }).ToList()
            };

            return stats;
        }
    }
}
