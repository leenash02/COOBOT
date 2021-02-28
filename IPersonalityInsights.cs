
using IBM.Cloud.SDK.Core.Http;
using IBM.Watson.PersonalityInsights.v3.Model;

namespace COOBOT.AI.Watson
{
    public interface IPersonalityInsights
    {
        DetailedResponse<Profile> GetInsights(string text);
    }
}
