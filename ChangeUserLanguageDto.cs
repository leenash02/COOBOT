using System.ComponentModel.DataAnnotations;

namespace COOBOT.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}