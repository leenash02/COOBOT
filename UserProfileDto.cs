using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace COOBOT.UserProfiles.Dto
{
    [AutoMap(typeof(UserProfile))]
    public class UserProfileDto : EntityDto<int>
    {
        public long UserId { get; set; }
        public string PersonalityInsights { get; set; }
        public string NLUResults { get; set; }
        public string CoopsQuery { get; set; }
        public bool RefreshInsights { get; set; }
    }
}