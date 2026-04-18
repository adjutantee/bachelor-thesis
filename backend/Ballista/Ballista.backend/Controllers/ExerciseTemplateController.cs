using AutoMapper;
using Ballista.Application.DTOs;
using Ballista.Domain.Entities;
using Ballista.Infrastructure.DbContexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ballista.backend.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/exercise-templates")]
    public class ExerciseTemplateController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IMapper _mapper;

        public ExerciseTemplateController(ApplicationDbContext db, IMapper mapper)
        {
            _db = db; _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<ExerciseTemplateDto>> Get()
            => _mapper.Map<IEnumerable<ExerciseTemplateDto>>
                 (await _db.ExerciseTemplates.Include(t => t.Discipline).ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ExerciseTemplateDto dto)
        {
            var template = _mapper.Map<ExerciseTemplate>(dto);
            _db.ExerciseTemplates.Add(template);
            await _db.SaveChangesAsync();
            return Ok(_mapper.Map<ExerciseTemplateDto>(template));
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var exerciseId = await _db.ExerciseTemplates.FirstOrDefaultAsync(t => t.Id == id);
                _db.ExerciseTemplates.Remove(exerciseId);
                _db.SaveChanges();

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
