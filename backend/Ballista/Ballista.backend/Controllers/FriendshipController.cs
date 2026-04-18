using Ballista.Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ballista.backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendshipController : ControllerBase
    {
        private readonly IFriendshipService _friendshipService;
        private readonly ILogger<FriendshipController> _logger;

        public FriendshipController(IFriendshipService friendshipService, ILogger<FriendshipController> logger)
        {
            _friendshipService = friendshipService;
            _logger = logger;
        }

        /// <summary>
        /// Отправка запроса в друзья.
        /// </summary>
        /// <param name="friendId">ID пользователя, которому отправляется запрос.</param>
        [HttpPost("send-request/{friendId}")]
        public async Task<IActionResult> SendRequest(Guid friendId)
        {
            try
            {
                if (friendId == Guid.Empty)
                {
                    return BadRequest(new { Message = "Некорректный ID друга." });
                }

                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                await _friendshipService.SendRequestAsync(userId, friendId);

                _logger.LogInformation("Пользователь {UserId} отправил запрос на добавление в друзья по адресу {FriendId}", userId, friendId);

                return Ok(new { Message = "Запрос в друзья отправлен" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Запрос на добавление в друзья уже существует");
                return Conflict(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при отправке запроса в друзья");
                return StatusCode(500, new { Message = "Произошла ошибка при отправке запроса" });
            }
        }

        /// <summary>
        /// Принятие запроса в друзья.
        /// </summary>
        /// <param name="friendshipId">ID запроса дружбы.</param>
        [HttpPost("accept-request/{friendshipId}")]
        public async Task<IActionResult> AcceptRequest(Guid friendshipId)
        {
            try
            {
                if (friendshipId == Guid.Empty)
                {
                    return BadRequest(new { Message = "Некорректный ID запроса дружбы." });
                }

                await _friendshipService.AcceptRequestAsync(friendshipId);

                _logger.LogInformation("Запрос на добавление в друзья {FriendshipId} был принят", friendshipId);

                return Ok(new { Message = "Запрос в друзья принят" });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Запрос на дружбу не найден: {FriendshipId}", friendshipId);
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при принятии запроса в друзья");
                return StatusCode(500, new { Message = "Произошла ошибка при принятии запроса" });
            }
        }

        /// <summary>
        /// Отклонение запроса в друзья.
        /// </summary>
        /// <param name="friendshipId">ID запроса дружбы.</param>
        [HttpPost("reject-request/{friendshipId}")]
        public async Task<IActionResult> RejectRequest(Guid friendshipId)
        {
            try
            {
                if (friendshipId == Guid.Empty)
                {
                    return BadRequest(new { Message = "Некорректный ID запроса дружбы." });
                }

                await _friendshipService.RejectRequestAsync(friendshipId);

                _logger.LogInformation("Friend request {FriendshipId} was rejected", friendshipId);

                return Ok(new { Message = "Запрос в друзья отклонен" });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Запрос на дружбу не найден: {FriendshipId}", friendshipId);
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Произошла ошибка при отклонении запроса");
                return StatusCode(500, new { Message = "Произошла ошибка при отклонении запроса" });
            }
        }

        /// <summary>
        /// Удаление пользователя из друзей.
        /// </summary>
        /// <param name="friendId">ID друга.</param>
        [HttpDelete("remove-friend/{friendId}")]
        public async Task<IActionResult> RemoveFriend(Guid friendId)
        {
            try
            {
                if (friendId == Guid.Empty)
                {
                    return BadRequest(new { Message = "Некорректный ID друга." });
                }

                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                await _friendshipService.RemoveFriendAsync(userId, friendId);

                _logger.LogInformation("User {UserId} removed friend {FriendId}", userId, friendId);

                return Ok(new { Message = "Пользователь удален из списка друзей" });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Не найдено связи между {userId} и {FriendID}", User.FindFirstValue(ClaimTypes.NameIdentifier), friendId);
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Произошла ошибка при удалении пользователя");
                return StatusCode(500, new { Message = "Произошла ошибка при удалении пользователя" });
            }
        }

        /// <summary>
        /// Получение списка друзей пользователя.
        /// </summary>
        [HttpGet("friends")]
        public async Task<IActionResult> GetFriends()
        {
            try
            {
                var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var friends = await _friendshipService.GetFriendsAsync(userId);

                _logger.LogInformation("Восстановленный список друзей пользователя {UserId}", userId);

                return Ok(friends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Произошла ошибка при получении списка друзей");
                return StatusCode(500, new { Message = "Произошла ошибка при получении списка друзей" });
            }
        }
    }
}
