using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using COOBOT.UserProfiles.Dto;
using System.Threading.Tasks;
using COOBOT.AI.Watson;
using COOBOT.UserUploads;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System;
using Abp.UI;
using IBM.Cloud.SDK.Core.Http;
using System.Text.Json;
using IBM.Watson.Discovery.v1.Model;
using Abp.Application.Services.Dto;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace COOBOT.UserProfiles
{
    public class UserProfileAppService : AsyncCrudAppService<UserProfile, UserProfileDto>, IApplicationService
    {
        private readonly IRepository<UserProfile> _userProfileRepository;
        private readonly IRepository<UserUpload> _userUploadRepository;
        private readonly IMapper _mapper;
        private readonly IPersonalityInsights _watsonPI;
        private readonly IDiscovery _watsonDiscovery;
        private readonly INaturalLanguageUnderstanding _watsonNLU;

        public UserProfileAppService(
            IRepository<UserProfile> repository,
            IRepository<UserUpload> userUploadRepository,
            IMapper mapper,
            IPersonalityInsights watsonPI,
            IDiscovery watsonDiscovery,
            INaturalLanguageUnderstanding watsonNLU) : base(repository)
        {
            _userProfileRepository = repository;
            _userUploadRepository = userUploadRepository;
            _mapper = mapper;
            _watsonPI = watsonPI;
            _watsonDiscovery = watsonDiscovery;
            _watsonNLU = watsonNLU;
        }

        /// <summary>
        /// Retrieves the results of NLU and Personality Insights analysis of the user's resume
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<UserProfileDto> GetUserProfileAsync()
        {
            UserProfileDto userProfile = new UserProfileDto();
            string personalityInsights = "";
            string nluAnalysisResult = "";
            
            UserProfile profile = await _userProfileRepository.FirstOrDefaultAsync(p => p.UserId == AbpSession.UserId);
            if (profile != null)
            {
                //Did resume change? Is this profile up-to-date?
                if (profile.RefreshInsights)
                {
                    //Call Watson PI with the updated text
                    GetResultsFromWatson(out personalityInsights, out nluAnalysisResult);

                    //Update the existing profile
                    UserProfile oldProfile = await _userProfileRepository.GetAsync(profile.Id);
                    oldProfile.PersonalityInsights = personalityInsights;
                    oldProfile.NLUResults = nluAnalysisResult;
                    oldProfile.CoopsQuery = GetCoopQuery(nluAnalysisResult);
                    await _userProfileRepository.UpdateAsync(profile);
                }
                else
                {
                    //Load from database
                    personalityInsights = profile.PersonalityInsights;
                    nluAnalysisResult = profile.NLUResults;
                }
            }
            else
            {
                GetResultsFromWatson(out personalityInsights, out nluAnalysisResult);

                //Create a new profile and save the results from Watson APIs
                UserProfile newProfile = new UserProfile();
                newProfile.PersonalityInsights = personalityInsights;
                newProfile.NLUResults = nluAnalysisResult;
                newProfile.CoopsQuery = GetCoopQuery(nluAnalysisResult);
                newProfile.UserId = AbpSession.UserId.Value;
                newProfile.RefreshInsights = false;
                await _userProfileRepository.InsertAsync(newProfile);
            }

            userProfile.PersonalityInsights = personalityInsights;
            userProfile.NLUResults = nluAnalysisResult;
            return userProfile;
        }

        /// <summary>
        /// Queries a Watson Discovery collection of coops and entry-level jobs based on features learned
        /// from analysing the user's resume via NLU.
        /// </summary>
        /// <returns>Stringified JSON result from Watson Discovery</returns>
        public async Task<string> GetCoopsForUserAsync(PagedAndSortedResultRequestDto input)
        {
            //Load user's profile
            UserProfile profile = await _userProfileRepository.FirstOrDefaultAsync(p => p.UserId == AbpSession.UserId);
            if (profile != null && !String.IsNullOrEmpty(profile.CoopsQuery))
            {
                //CoopsQuery includes the "filter" which we use for location.
                //extract "filter" (query is like '...__location__location:Riyadh') and we'll extract 'location:Riyadh'
                string[] queryParts = profile.CoopsQuery.Split("__location__");
                return GetDocsFromWatson(queryParts[0], queryParts[1], input.MaxResultCount, input.SkipCount);
            }

            return "";
        }

        /// <summary>
        /// Queries Watson Discovery to return coops from a collection based on a query composed by analysing resume using NLU
        /// </summary>
        /// <param name="query"></param>
        /// <param name="count"></param>
        /// <param name="offset"></param>
        /// <returns></returns>
        private string GetDocsFromWatson(string query, string filter, int count, int offset)
        {
            DetailedResponse<QueryResponse> q = _watsonDiscovery.Query(query, filter, count, offset);
            return q.Response;
        }

        /// <summary>
        /// Calls Personality Insights and Natural Language Understanding APIs on the user's resume 
        /// </summary>
        /// <param name="personalityResult"></param>
        /// <param name="nluResult"></param>
        private void GetResultsFromWatson(out string personalityResult, out string nluResult)
        {
            string textForPI = "";
            string textForNLU = "";
            //Get the user's resume and cover letter extracted text
            List<UserUpload> files = _userUploadRepository.GetAll().Where(p => p.CreatorUserId == AbpSession.UserId).ToList();
            StringBuilder sb = new StringBuilder();

            //Make sure we have a resume
            if (files.Any(f => f.UploadType == 1 && !String.IsNullOrEmpty(f.ExtractedText)))
            {
                UserUpload resume = files.First(f => f.UploadType == 1);
                sb.Append(resume.ExtractedText);

                //get facts from the resume
                textForNLU = resume.ExtractedText;

                //is there a cover letter? Use it for PI
                UserUpload coverLetter = files.FirstOrDefault(f => f.UploadType == 2);
                if (coverLetter != null && !String.IsNullOrEmpty(coverLetter.ExtractedText))
                {
                    sb.Append(". ");
                    sb.Append(coverLetter.ExtractedText);
                }

                textForPI = sb.ToString();

                try
                {
                    DetailedResponse<IBM.Watson.PersonalityInsights.v3.Model.Profile> pi = _watsonPI.GetInsights(textForPI);
                    personalityResult = pi.Response;
                }
                catch (Exception ex)
                {
                    personalityResult = "error_" + ex.Message;
                }

                try
                {
                    DetailedResponse<IBM.Watson.NaturalLanguageUnderstanding.v1.Model.AnalysisResults> nlu = _watsonNLU.GetAnalysis(textForNLU);
                    nluResult = nlu.Response;
                }
                catch (Exception ex)
                {
                    nluResult = "error_" + ex.Message;
                }

            }
            else
            {
                throw new UserFriendlyException("Oops! COOBOT looked around and couldn't find content to analyze. \nPlease make sure you've uploaded a resume and verified the extracted text.");
            }
        }

        /// <summary>
        /// Composes an IBM Watson Discovery query to look for coops.
        /// Query syntax: https://cloud.ibm.com/docs/discovery?topic=discovery-query-reference
        /// </summary>
        /// <param name="NLUResult">Stringified JSON. Results from analyzing user resume</param>
        /// <returns></returns>
        private string GetCoopQuery(string NLUResult)
        {
            WatsonNLUResponse response = JsonConvert.DeserializeObject<WatsonNLUResponse>(NLUResult);
            string query = "";
            //We are looking in the enriched (NLU-processed) job descriptions
            string entityTextAndTypeTemplate = "enriched_description.entities:(text:{0},type:{1})";

            /*Process outline:
            An 'entity type' here represents a skill (or a university major or any other concept), which we have trained Watson to
            identify. Watson will return the entity type plus the resume text from which it identified this entity.

            Since we used the same NUL model for analysing the resume and the job descriptions, we're expecting the same set of 
            entity types from both analysis results.

            Query forming strategy is to look for jobs with words similar to the resume within each entity type.
            E.g. Get the words classified under TechnicalSkills entity from the user's resume and see if any of them exists in 
            the text that was classified as TechnicalSkills in the job description.
            */

            //Form a list of unique entity types.
            List<string> entityTypes = response.entities
                .GroupBy(e => e.type)
                .Select(e => e.Key)
                .ToList();
            //get all entities of that type and combine their text
            foreach (string entityType in entityTypes)
            {
                string terms = "";
                foreach (UserProfiles.Dto.Entity entity in response.entities.Where(e => e.type == entityType))
                {
                    terms += (terms == "" ? "" : "|") + entity.text;
                }
                query += (query == "" ? "" : "|") + String.Format(entityTextAndTypeTemplate, terms, entityType);
            }

            //add the most significant categories
            if (response.categories.Any(c => c.score > 0.75))
            {
                string categories = "";
                string categoryTemplate = "enriched_description.categories:(label:{0},score>0.75)";
                foreach (UserProfiles.Dto.Category category in response.categories.Where(c => c.score > 0.75))
                {
                    categories += (categories == "" ? "" : "|") + category.label.Replace("/", " ");
                }
                query += "," + String.Format(categoryTemplate, categories);
            }

            //append the location part (distinquish it so we can later separate it from the query - Watson expects it as a separate parameter)
            if (response.entities.Any(e => e.type == "Location"))
            {
                string city = "Riyadh"; //default
                UserProfiles.Dto.Entity entity = response.entities.FirstOrDefault(e => e.type == "Location");
                if (entity.text.IndexOf(",") > 0)
                {
                    string[] locationParts = entity.text.Split(",");
                    //assuming the location has the format "city, country"
                    city = locationParts[0];
                }
                query += "__location__" + "location:" + city;
            }

            return query;
        }

    }
}
