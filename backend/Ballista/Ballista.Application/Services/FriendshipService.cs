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
    public class FriendshipService : IFriendshipService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public FriendshipService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AcceptRequestAsync(Guid friendshipId)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => f.Id == friendshipId);

            if (friendship == null)
            {
                throw new KeyNotFoundException("Запрос в друзья не найден");
            }

            friendship.Status = FriendshipStatus.Accepted;
            await _context.SaveChangesAsync();
        }

        public async Task<List<FriendshipDto>> GetFriendsAsync(Guid userId)
        {
            var friendships = await _context.Friendships
                .Where(f => (f.UserId == userId || f.FriendId == userId) && f.Status == FriendshipStatus.Accepted)
                .ToListAsync();

            return _mapper.Map<List<FriendshipDto>>(friendships); ;
        }

        public async Task RejectRequestAsync(Guid friendshipId)
        {
            var friendship = await _context.Friendships.FindAsync(friendshipId);
            if (friendship == null) throw new KeyNotFoundException("Запрос не найден");

            friendship.Status = FriendshipStatus.Rejected;
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFriendAsync(Guid userId, Guid friendId)
        {
            var friendship = await _context.Friendships
                .FirstOrDefaultAsync(f => (f.UserId == userId && f.FriendId == friendId)
                                       || (f.UserId == friendId && f.FriendId == userId));

            if (friendship == null) throw new KeyNotFoundException("Пользователь не найден в списке друзей");

            _context.Friendships.Remove(friendship);
            await _context.SaveChangesAsync();
        }

        public async Task SendRequestAsync(Guid userId, Guid friendId)
        {
            var exists = await _context.Friendships
                .AnyAsync(f => (f.UserId == userId && f.FriendId == friendId)
                             || (f.UserId == friendId && f.FriendId == userId));

            if (exists)
                throw new InvalidOperationException("Запрос уже существует");

            var friendship = new Friendship
            {
                UserId = userId,
                FriendId = friendId,
                Status = FriendshipStatus.Pending
            };

            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();
        }
    }
}
