using Ballista.Application.Data;
using Ballista.Application.DTOs;
using Ballista.Application.Services.Interfaces;
using Ballista.Domain.Entities;
using Ballista.Infrastructure.DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ballista.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IAuthenticationService _authenticationService;
        private readonly ApplicationDbContext _context;

        public AuthenticationController(UserManager<User> userManager, IAuthenticationService authenticationService, ApplicationDbContext context)
        {
            _userManager = userManager;
            _authenticationService = authenticationService;
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(Login login)
        {
            try
            {
                // Проверка данных входа
                if (string.IsNullOrWhiteSpace(login.LoginEmail))
                {
                    return BadRequest(new { Message = "Необходимо указать логин или email." });
                }

                // Поиск пользователя по email
                var user = await _userManager.FindByEmailAsync(login.LoginEmail);

                if (user == null)
                {
                    return NotFound(new { Message = "Пользователь не найден." });
                }

                // Проверка пароля
                var isPasswordValid = await _userManager.CheckPasswordAsync(user, login.LoginPassword);
                if (!isPasswordValid)
                {
                    return Unauthorized(new { Message = "Неверный пароль." });
                }

                // Генерация Access Token
                var accessToken = await _authenticationService.GenerateJwtTokenByUser(user);

                // Генерация Refresh Token
                var refreshToken = new RefreshToken
                {
                    Token = _authenticationService.GenerateRefreshToken(),
                    UserId = user.Id,
                    Expires = DateTime.UtcNow.AddDays(7), // Refresh Token действует 7 дней
                    IsRevoked = false
                };

                // Сохранение Refresh Token в базе данных
                _context.RefreshTokens.Add(refreshToken);
                user.LastLoginDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Возвращение Access и Refresh Token
                return Ok(new
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken.Token
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("Register")]
        public async Task<IActionResult> Register(Register register)
        {
            try
            {
                var existingUserByEmail = await _userManager.FindByEmailAsync(register.RegisterEmail);

                if (existingUserByEmail != null)
                {
                    return Conflict(new { Message = "Электронная почта уже используется" });
                }

                var existingUserByName = await _userManager.FindByNameAsync(register.RegisterUserName);

                if (existingUserByName != null)
                {
                    return Conflict(new { Message = "Логин уже используется" });
                }

                if (register.RegisterPassword != register.RegisterReTypePassword)
                {
                    return BadRequest(new {Message = "Пароли не совпадают"});
                }

                var user = new User
                {
                    FirstName = register.RegisterFirstName,
                    LastName = register.RegisterLastName,
                    UserName = register.RegisterUserName,
                    Email = register.RegisterEmail,
                    RegistrationDate = DateTime.UtcNow,
                };

                var result = await _userManager.CreateAsync(user, register.RegisterPassword);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, Constants.UserRoleName);
                    await _context.SaveChangesAsync();

                    return Ok(new { Message = "Успешная регистрация" });
                }
                else
                {
                    return StatusCode(500);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null)
                return NotFound();

            var dto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                RegistrationDate = user.RegistrationDate,
                LastLoginDate = user.LastLoginDate
            };

            return Ok(dto);
        }


        [HttpPost("RefreshToken")]
        public async Task<IActionResult> Refresh([FromBody] string refreshToken)
        {
            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken == null || storedToken.IsExpired || storedToken.IsRevoked)
            {
                return Unauthorized(new { Message = "Invalid or expired refresh token." });
            }

            // Создаем новый Access Token
            var user = storedToken.User;
            var newAccessToken = await _authenticationService.GenerateJwtTokenByUser(user);

            // Обновляем Refresh Token (можно выдать новый)
            storedToken.Token = _authenticationService.GenerateRefreshToken();
            storedToken.Expires = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            return Ok(new { token = newAccessToken, refreshToken = storedToken.Token });
        }

        [HttpPost("RevokeToken")]
        public async Task<IActionResult> Revoke(string refreshToken)
        {
            var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);

            if (storedToken == null)
            {
                return NotFound(new { Message = "Токен обновления не найден" });
            }

            storedToken.IsRevoked = true;
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Токен обновления успешно отозван" });
        }

    }
}
