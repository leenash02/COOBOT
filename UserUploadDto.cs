using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace COOBOT.UserUploads.Dto
{
    [AutoMap(typeof(UserUpload))]
    public class UserUploadDto : EntityDto<int>
    {
        public string FileName { get; set; }
        public short UploadType { get; set; }
        public string ExtractedText { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
    }
}