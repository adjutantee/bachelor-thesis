using System.ComponentModel.DataAnnotations;

namespace Ballista.Domain.Entities
{
    public class Register
    {
        [Required]
        public string RegisterUserName { get; set; }
        [Required]
        public string RegisterEmail { get; set; }
        [Required]
        public string RegisterFirstName { get; set; }
        [Required]
        public string RegisterLastName { get; set; }
        [Required]
        public string RegisterPassword { get; set; }
        [Required]
        [Compare("RegisterPassword")]
        public string RegisterReTypePassword { get; set; }
    }
}
