using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper;
using COOBOT.UserUploads.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace COOBOT.UserUploads
{
    public class UserUploadAppService : AsyncCrudAppService<UserUpload, UserUploadDto>, IApplicationService
    {
        private readonly IRepository<UserUpload> _userUploadRepository;
        private readonly IMapper _mapper;
        private readonly Util.PDFExtractor.ITextExtractor _pdfExtractor;
        private readonly Util.WordExtractor.ITextExtractor _wordExtractor;
        public UserUploadAppService(
            IRepository<UserUpload> repository,
            IMapper mapper,
            Util.PDFExtractor.ITextExtractor pdfExtractor,
            Util.WordExtractor.ITextExtractor wordExtractor
            ) : base(repository)
        {
            _userUploadRepository = repository;
            _mapper = mapper;
            _pdfExtractor = pdfExtractor;
            _wordExtractor = wordExtractor;
        }

        /// <summary>
        /// Checks if the current user has already uploaded a resume.
        /// UploadType 1 = Resume; 2 = Cover Letter
        /// </summary>
        /// <returns></returns>
        public bool GetUserHasResume()
        {
            return _userUploadRepository.GetAll().Where(u => u.CreatorUserId == AbpSession.UserId && u.UploadType == 1).Any();
        }

        [HttpPost]
        public async Task<UserUploadDto> UploadAsync([FromForm] IFormFile file, [FromForm] string uploadType)
        {
            UserUpload upload = new UserUpload();
            upload.UploadType = uploadType == "resume" ? Int16.Parse("1") : Int16.Parse("2");
            upload.FileName = file.FileName;
            upload.FileSize = file.Length;
            upload.FileType = file.FileName.Split(".")[1];

            if (upload.FileType != "pdf" && upload.FileType != "docx")
            {
                throw new UserFriendlyException("Invalid file type!");
            }

            //Read the file into a memory stream to convert it to byte array
            using (MemoryStream targetStream = new MemoryStream())
            {
                Stream sourceStream = file.OpenReadStream();
                sourceStream.CopyTo(targetStream);
                upload.BinaryContent = targetStream.ToArray();

                //Extract text from file
                if (upload.FileType == "pdf")
                {
                    upload.ExtractedText = _pdfExtractor.ExtractText(upload.BinaryContent);
                }
                else if (upload.FileType == "docx")
                {
                    upload.ExtractedText = _wordExtractor.ExtractText(upload.BinaryContent);
                }

                sourceStream.Dispose();
            }


            int Id = await _userUploadRepository.InsertAndGetIdAsync(upload);
            upload.Id = Id;
            return _mapper.Map<UserUploadDto>(upload);
        }

        /// <summary>
        /// Overrides Abp's Update method to only update the extracted text
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async override Task<UserUploadDto> UpdateAsync(UserUploadDto input)
        {
            UserUpload upload = _userUploadRepository.Get(input.Id);
            if (upload != null)
            {
                upload.ExtractedText = input.ExtractedText;
            }
            UserUpload newUpload = await _userUploadRepository.UpdateAsync(upload);
            return _mapper.Map<UserUploadDto>(newUpload);
        }
    }
}
