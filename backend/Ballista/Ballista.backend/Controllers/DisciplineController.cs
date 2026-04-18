using Ballista.Application.DTOs;
using Ballista.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ballista.backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DisciplineController : ControllerBase
    {
        private readonly IDisciplineService _disciplineService;

        public DisciplineController(IDisciplineService disciplineService)
        {
            _disciplineService = disciplineService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var disciplines = await _disciplineService.GetAllDisciplinesAsync();
            return Ok(disciplines);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DisciplineDto dto)
        {
            var created = await _disciplineService.CreateDisciplineAsync(dto);
            return CreatedAtAction(nameof(GetAll), created);
        }

        [HttpDelete("{disciplineId}")]
        public async Task<IActionResult> Delete(Guid disciplineId)
        {
            try
            {
                await _disciplineService.DeleteDisciplineAsync(disciplineId);
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
