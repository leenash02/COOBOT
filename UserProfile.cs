using Abp.Domain.Entities;
using COOBOT.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Text;

namespace COOBOT.UserProfiles
{
    public class UserProfile : Entity<int>
    {
        public long UserId { get; set; }
        public string PersonalityInsights { get; set; }
        public string NLUResults { get; set; }
        public string CoopsQuery { get; set; }
        /*RefreshInsights is a flag that is set to true whenever ther user's resume or cover letter change.
         * This will cause the app to re-query Watson's PI, and store the new results in the database replacing the old ones.
         * Otherwise, we display the cached results from the last API query.
        */
        public bool RefreshInsights { get; set; }
        public virtual User ProfileOwnerUser { get; set; }
    }
}
