using Ballista.Application.DTOs;
using Ballista.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace Ballista.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShootingSessionController : ControllerBase
    {
        private readonly IShootingSessionService _shootingSessionService;
        private readonly ILogger<ShootingSessionController> _logger;

        public ShootingSessionController(IShootingSessionService shootingSessionService, ILogger<ShootingSessionController> logger)
        {
            _shootingSessionService = shootingSessionService;
            _logger = logger;
        }

        /// <summary>
        /// Получить все сессии стрельбы текущего пользователя.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                var shootingSessions = await _shootingSessionService.GetShootingSessionsByUserIdAsync(userId);

                if (shootingSessions.IsNullOrEmpty())
                {
                    return NotFound(new { Message = "У вас нет сессий стрельбы." });
                }

                return Ok(shootingSessions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении сессий стрельбы для пользователя {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { Message = "Ошибка сервера при получении сессий стрельбы." });
            }
        }

        /// <summary>
        /// Создать новую сессию стрельбы.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateShootingSessionDto sessionDto)
        {
            try
            {
                if (sessionDto == null)
                {
                    return BadRequest(new { Message = "Данные сессии не могут быть пустыми." });
                }

                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var createdSession = await _shootingSessionService.CreateShootingSessionAsync(userId, sessionDto);

                return CreatedAtAction(nameof(Get), new { id = createdSession.Id }, createdSession);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании сессии стрельбы для пользователя {UserId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { Message = "Ошибка сервера при создании сессии стрельбы." });
            }
        }


        /// <summary>
        /// Обновить сессию стрельбы текущего пользователя.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateShootingSessionDto sessionDto)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var updatedSession = await _shootingSessionService.UpdateShootingSessionAsync(userId, id, sessionDto);

                return Ok(updatedSession);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = $"Сессия с ID {id} не найдена." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("Вы не можете обновить эту сессию.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении сессии {SessionId} для пользователя {UserId}", id, User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { Message = "Ошибка сервера при обновлении сессии стрельбы." });
            }
        }

        /// <summary>
        /// Удалить сессию стрельбы текущего пользователя.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                await _shootingSessionService.DeleteShootingSessionAsync(userId, id);

                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = $"Сессия с ID {id} не найдена." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("Вы не можете удалить эту сессию.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении сессии {SessionId} для пользователя {UserId}", id, User.FindFirstValue(ClaimTypes.NameIdentifier));
                return StatusCode(500, new { Message = "Ошибка сервера при удалении сессии стрельбы." });
            }
        }
    }
}
