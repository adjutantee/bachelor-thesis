using Ballista.Application.DTOs;
using Ballista.Application.Services;
using Ballista.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ballista.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeaponTypeController : ControllerBase
    {
        private readonly IWeaponTypeService _weaponService;

        public WeaponTypeController(IWeaponTypeService weaponService)
        {
            _weaponService = weaponService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWeapons ()
        {
            var weapons = await _weaponService.GetAllWeaponsAsync();
            return Ok(weapons);
        }

        [HttpGet("{disciplineId}")]
        public async Task<IActionResult> GetByDiscipline(Guid disciplineId)
        {
            var weapons = await _weaponService.GetWeaponsByDisciplineAsync(disciplineId);
            return Ok(weapons);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] WeaponTypeDto dto)
        {
            var created = await _weaponService.CreateWeaponTypeAsync(dto);
            return CreatedAtAction(nameof(GetByDiscipline), new { disciplineId = dto.DisciplineId }, created);
        }

        [HttpDelete("{weaponTypeId}")]
        public async Task<IActionResult> Delete(Guid weaponTypeId)
        {
            try
            {
                await _weaponService.DeleteWeaponTypeAsync(weaponTypeId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { ex.Message });
            }
        }
    }
}
