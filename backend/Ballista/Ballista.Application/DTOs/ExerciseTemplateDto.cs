using Ballista.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ballista.Application.DTOs
{
    public class ExerciseTemplateDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid DisciplineId { get; set; }
        public string DisciplineName { get; set; }
        public int SeriesCount { get; set; }
        public int ShotsPerSeries { get; set; }
    }
}
