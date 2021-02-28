using IBM.Cloud.SDK.Core.Http;
using IBM.Watson.PersonalityInsights.v3.Model;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using IBM.Watson.PersonalityInsights.v3;

namespace COOBOT.AI.Watson
{
    /// <summary>
    /// Deprecated: IBM® will begin sunsetting IBM Watson™ Personality Insights on 1 December 2020.
    /// For a period of one year from this date, you will still be able to use Watson Personality Insights. 
    /// However, as of 1 December 2021, the offering will no longer be available. 
    /// As an alternative, we encourage you to consider migrating to IBM Watson™ Natural Language Understanding, 
    /// a service on IBM Cloud® that uses deep learning to extract data and insights from text such as keywords, 
    /// categories, sentiment, emotion, and syntax to provide insights for your business or industry.
    /// </summary>
    public class PersonalityInsights : IPersonalityInsights
    {
        private readonly IConfiguration _appConfiguration;

        public PersonalityInsights(IConfiguration appConfiguration)
        {
            _appConfiguration = appConfiguration;
        }
        public DetailedResponse<Profile> GetInsights(string text)
        {
            string apiKey = _appConfiguration["WatsonAPIs:PersonalityInsights:Key"];
            string version = _appConfiguration["WatsonAPIs:PersonalityInsights:Version"];
            string instanceURL = _appConfiguration["WatsonAPIs:PersonalityInsights:InstanceURL"];

            //Check settings are OK
            if (String.IsNullOrEmpty(apiKey) || String.IsNullOrEmpty(version) || String.IsNullOrEmpty(instanceURL))
            {
                throw new Exception("Invalid PersonalityInsights API configuration. Please check appsettings.json.");
            }

            IamAuthenticator authenticator = new IamAuthenticator(apikey: apiKey);
            PersonalityInsightsService personalityInsights = new PersonalityInsightsService(version, authenticator);
            personalityInsights.SetServiceUrl(instanceURL);
            personalityInsights.DisableSslVerification(true);

            Content content = new Content();
            List<ContentItem> lst = new List<ContentItem>();
            lst.Add(new ContentItem()
            {
                Content = text, 
                Contenttype = "text/plain",
                Language = "en"
            });
            content.ContentItems = lst;

            return personalityInsights.Profile(
                 content: content,
                 contentType: "text/plain",
                 rawScores: true,
                 consumptionPreferences: false
                 );

        }
    }
}
