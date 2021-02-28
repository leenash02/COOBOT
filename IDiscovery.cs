using IBM.Cloud.SDK.Core.Http;
using IBM.Watson.Discovery.v1.Model;

namespace COOBOT.AI.Watson
{
    public interface IDiscovery
    {
        DetailedResponse<QueryResponse> Query(string query, string filter, int count, int offset);
    }
}
