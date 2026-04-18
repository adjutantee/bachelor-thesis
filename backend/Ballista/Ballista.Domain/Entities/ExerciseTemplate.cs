using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ballista.Domain.Entities
{
    public class ExerciseTemplate // шаблон упражнения
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid DisciplineId { get; set; }
        public Discipline Discipline { get; set; }
        public int SeriesCount { get; set; }            // кол-во серий
        public int ShotsPerSeries { get; set; }         // кол-во выстрелов
    }
}
