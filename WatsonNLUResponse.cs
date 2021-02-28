using System;
using System.Collections.Generic;
using System.Text;

namespace COOBOT.UserProfiles.Dto
{
    /// <summary>
    /// Helper class to make parsing and querying JSON easier
    /// </summary>
    public class WatsonNLUResponse
    {
        public Usage usage { get; set; }
        public string language { get; set; }
        public List<Keyword> keywords { get; set; }
        public List<Entity> entities { get; set; }
        public List<Category> categories { get; set; }
    }

    public class Usage
    {
        public int text_units { get; set; }
        public int text_characters { get; set; }
        public int features { get; set; }
    }

    public class Keyword
    {
        public string text { get; set; }
        public double relevance { get; set; }
        public int count { get; set; }
    }

    public class Disambiguation
    {
        public List<string> subtype { get; set; }
    }

    public class Entity
    {
        public string type { get; set; }
        public string text { get; set; }
        public Disambiguation disambiguation { get; set; }
        public int count { get; set; }
        public double confidence { get; set; }
    }

    public class Category
    {
        public double score { get; set; }
        public string label { get; set; }
    }

}
