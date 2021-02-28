using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using COOBOT.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace COOBOT.UserUploads
{
    public class UserUpload : Entity<int>, ICreationAudited
    {
        [MaxLength(500)]
        public string FileName { get; set; }
        public short UploadType { get; set; }
        public byte[] BinaryContent { get; set; }
        public string ExtractedText { get; set; }
        [MaxLength(50)]
        public string FileType { get; set; }
        public long FileSize { get; set; }


        public virtual DateTime CreationTime { get; set; }
        public long? CreatorUserId { get; set; }
        public virtual User CreatorUser { get; set; }

    }
}
