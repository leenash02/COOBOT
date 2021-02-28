using IBM.Cloud.SDK.Core.Http;
using IBM.Watson.NaturalLanguageUnderstanding.v1.Model;
using System;

namespace COOBOT.AI.Watson
{
    public interface INaturalLanguageUnderstanding
    {
        DetailedResponse<AnalysisResults> GetAnalysis(string text);
    }
}
