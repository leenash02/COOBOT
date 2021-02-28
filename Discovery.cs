using IBM.Cloud.SDK.Core.Http;
using System;
using Microsoft.Extensions.Configuration;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using IBM.Watson.Discovery.v1;
using IBM.Watson.Discovery.v1.Model;

namespace COOBOT.AI.Watson
{
    public class Discovery : IDiscovery
    {
        private readonly IConfiguration _appConfiguration;

        public Discovery(IConfiguration appConfiguration)
        {
            _appConfiguration = appConfiguration;
        }

        public DetailedResponse<QueryResponse> Query(string query, string filter, int count, int offset)
        {
            string apiKey = _appConfiguration["WatsonAPIs:Discovery:Key"];
            string version = _appConfiguration["WatsonAPIs:Discovery:Version"];
            string instanceURL = _appConfiguration["WatsonAPIs:Discovery:InstanceURL"];
            string environmentId = _appConfiguration["WatsonAPIs:Discovery:EnvironmentId"];
            string collectionId = _appConfiguration["WatsonAPIs:Discovery:CollectionId"];

            //Check settings are OK
            if (String.IsNullOrEmpty(apiKey) || String.IsNullOrEmpty(version) || String.IsNullOrEmpty(instanceURL))
            {
                throw new Exception("Invalid Discovery API configuration. Please check appsettings.json.");
            }

            IamAuthenticator authenticator = new IamAuthenticator(apikey: apiKey);
            DiscoveryService discovery = new DiscoveryService(version, authenticator);
            discovery.SetServiceUrl(instanceURL);
            discovery.DisableSslVerification(true);

            return discovery.Query(
            environmentId: environmentId,
            collectionId: collectionId,
            filter: string.IsNullOrEmpty(filter) ? null : filter,
            query: query,
            passages: false,
            count: count,
            offset: offset
            );

        }
    }
}
