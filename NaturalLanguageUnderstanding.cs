using IBM.Cloud.SDK.Core.Http;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using IBM.Watson.NaturalLanguageUnderstanding.v1.Model;
using IBM.Watson.NaturalLanguageUnderstanding.v1;

namespace COOBOT.AI.Watson
{
    public class NaturalLanguageUnderstanding : INaturalLanguageUnderstanding
    {
        private readonly IConfiguration _appConfiguration;

        public NaturalLanguageUnderstanding(IConfiguration appConfiguration)
        {
            _appConfiguration = appConfiguration;
        }

        public DetailedResponse<AnalysisResults> GetAnalysis(string text)
        {
            string apiKey = _appConfiguration["WatsonAPIs:NLU:Key"];
            string version = _appConfiguration["WatsonAPIs:NLU:Version"];
            string instanceURL = _appConfiguration["WatsonAPIs:NLU:InstanceURL"];
            string modelId = _appConfiguration["WatsonAPIs:NLU:ModelId"];

            //Check settings are OK
            if (String.IsNullOrEmpty(apiKey) || String.IsNullOrEmpty(version) || String.IsNullOrEmpty(instanceURL))
            {
                throw new Exception("Invalid NLU API configuration. Please check appsettings.json.");
            }

            IamAuthenticator authenticator = new IamAuthenticator(apikey: apiKey);
            NaturalLanguageUnderstandingService naturalLanguageUnderstanding = new NaturalLanguageUnderstandingService(version, authenticator);
            naturalLanguageUnderstanding.SetServiceUrl(instanceURL);

            //Specify the features we want to receive
            var features = new Features()
            {
                Keywords = new KeywordsOptions()
                {
                    Limit = 20,
                },
                Entities = new EntitiesOptions()
                {
                    Limit = 60
                },
                Categories = new CategoriesOptions()
                {
                    Limit = 20
                }
            };

            //Use our custom model for identifying entities
            if (!String.IsNullOrEmpty(modelId))
            {
                features.Entities.Model = modelId;
            }

            return naturalLanguageUnderstanding.Analyze(
            features: features,
            text: text
            );

        }
    }
}
