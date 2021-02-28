using AutoMapper;

namespace COOBOT.UserUploads.Dto
{
    public class UserUploadMapProfile : Profile
    {
        public UserUploadMapProfile()
        {
            //Maps the two types so they are directly assignable to one another (i.e. without assiging individual fields' values)
            CreateMap<UserUpload, UserUploadDto>().ReverseMap();
        }
    }
}
