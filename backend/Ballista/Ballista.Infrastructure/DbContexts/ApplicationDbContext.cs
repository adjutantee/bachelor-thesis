using Ballista.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Ballista.Infrastructure.DbContexts
{
    public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<WeaponType> WeaponTypes { get; set; }
        public DbSet<ShootingSession> ShootingSessions { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Discipline> Disciplines { get; set; }
        public DbSet<Shot> Shots { get; set; }
        public DbSet<ExerciseTemplate> ExerciseTemplates { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Конфигурация Friendship
            modelBuilder.Entity<Friendship>()
                .HasKey(f => new { f.UserId, f.FriendId });

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.User)
                .WithMany(u => u.Friendships)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.Friend)
                .WithMany(u => u.FriendOf)
                .HasForeignKey(f => f.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            // Конфигурация ShootingSession
            modelBuilder.Entity<ShootingSession>(entity =>
            {
                // связь с User
                entity.HasOne(ss => ss.User)
                    .WithMany(u => u.ShootingSessions)
                    .HasForeignKey(ss => ss.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Связь с Discipline
                entity.HasOne(ss => ss.Discipline)
                    .WithMany()
                    .HasForeignKey(ss => ss.DisciplineId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Связь с WeaponType
                entity.HasOne(ss => ss.WeaponType)
                    .WithMany()
                    .HasForeignKey(ss => ss.WeaponTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Конфигурация WeaponType
            modelBuilder.Entity<WeaponType>()
                    .HasMany(w => w.ShootingSessions)
                    .WithOne(s => s.WeaponType)
                    .HasForeignKey(s => s.WeaponTypeId)
                    .OnDelete(DeleteBehavior.Restrict);


            // Конфигурация для Shot
            modelBuilder.Entity<Shot>()
                .HasOne(s => s.ShootingSession)
                .WithMany(ss => ss.Shots)
                .HasForeignKey(s => s.ShootingSessionId);
        }
    }
}
