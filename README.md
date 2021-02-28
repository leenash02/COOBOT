# COOBOT
An ASP.NET web application which recommends students suitable Coop vacancies from LinkedIn based on analysis done on their resumes by IBM's AI Watson.

Overview

COOBOT is a senior project developed by two software engineering students from KSA. Please note that this is just a DEMO/proof of concept. It is NOT meant to be used or relied on by actual students looking for coop/internship opportunities. However, it is a first step towards a final and fully reliable solution.   

COOBOT was developed using the following technologies: 
- Framework: ASP.NET Core
- Backend: Node.js
- Frontend: React
- Database: SQL
- AI: IBM's Watson. Specifically Watson Natural Langugae Understanding, Watson Personality Insights and Watson Discovery. 

Languages
- C#
- Typescript


Concept
- About 300 coop/internship vacancies in KSA were scraped from LinkedIn using this javascript scraper: . This data includes: name of position, city, company, link to the vacancy on LinkedIn, description and date posted.
- The data, in JSON format, was then uploaded to Watson Discovery's on-cloud corpus, and enriched with NLU analysis from a customized instance of Watson NLU, extracting key concepts and keywords such as required major, required skills set and location. The data was also run through Personality Analysis to obtain an idea about the needs and values represented in the coop/internship description. Both analysis will be later compared with the one done on the resumes. 
- Student uploads their CV/resume and/or a cover letter to COOBOT, the letter is optional but including it will help Personality Insights give better analysis regarding student's personality, needs and values. 
- The application extracts the text from said documents, then show it to the user for validation, as the process of extracting text (especially from PDF) is not optimal, and providing Watson with unsanitized data might pose a risk of obtaining inaccurate results/analysis. 
- The extraced text is then sent in pure text form to Personality Insights and NLU, the former returns analysis regarding student's Big 5 Personality Traits as well as their needs and values from the way they express themselves in written text. The latter, NLU, mainly analyzes resume text to obtain certian concepts, keywords, and other entities such as major, degree, technical and interpersonal skills that are outright mentioned or inferred from text. This is done by a custom instance of Watson NLU, which we trained to parse and understand the domain language of student resumes and job/coop/internship descriptions. 
- Finally, the application strings NLU results in a query format accepted by Watson Discovery, which returns the required coop/internship data based on the parameters provided. Each is tagged with a score representing Watson's confidence of how relevent the returned data is to the sent query.  
- The returned response is then visualized in order of relevance, and students can see how much they match with each of the recommended opportunities via charts. 

Note

Please consider, this is just the source code and very backbone of the application, which is hosted locally on our machines. If you would like to run and try it for yourself, you would have to go through the following steps: 

To run the application, kindly follow the steps to host the application on Microsoft IIS (Internet Information Services): 

1- If not already installed, enable IIS from Control Panel > Switch to Category View > Programs > Turn Windows Features ON or OFF > Locate IIS in the Windoes Feature dialog box and enable it. 

2- Install IIS module called "URL Rewrite" from "https://www.iis.net/downloads/microsoft/url-rewrite". (please make sure to scroll down to Download URL Rewrite Module 2.1)

3- Download and install .NET Core 3.1 Microsoft IIS Hosting bundle from "https://dotnet.microsoft.com/download/dotnet-core/3.1" (can be located on the right side under ASP.NET Core Runtime 3.1.10, please make sure you download Hosting Bundle.)

4- Install MS SQL Server Express from "https://www.microsoft.com/en-sa/sql-server/sql-server-downloads?SilentAuth=1&wa=wsignin1.0" as well as MS SQL Server Management Studio form "https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15".

5- After establishing a connection to the server, please make note of your username and password, then create an empty database called "COOBOT". 

6- From the folder "published" attached in this zip, navigate to "published" -> "migrations", locate an executable (.exe) file named "COOBOT.Migrator.exe" and run it. (command line will open asking you to confrim, just type "y" and enter) make sure are migrations are applied.

7- In the folder "published", navigate to "published" -> "migrations", locate a file named "appsettings.json", open it and change "ConnectionStrings" such that it matches your own SQL server credentials. Do the same in the appsettings.json file in "published" -> "coobot-api" folder as well. 

8- Open the file attached in this zip called "PopulateCoopPersonalityInsights.sql" in SQL Management Studio and execute the query. 

9- After execution is successful, copy folders "coobot" and "coobot-api" from folder "published" into this directory "C:/inetpub/wwwroot"

10- open IIS Manager, on the left pane, you will see "YourComputerName(YourComputerName\YourUserName)" expand it, then expand Sites, and then Default Web Site.

11- In Default Web Site, you should be able to see the two folders you moved, "coobot-api" and "coobot".

12- Right click on each and select "convert to application".

13- Finally, run the app by selecting "coobot" and choosing "Browse *:80 (HTTP) fomr the right side pane, or just type "localhost:/coobot/" as URL in your browser. (preferrably Chrome, but certainly not IE as the application uses modern javascript that does not run properly on IE)



