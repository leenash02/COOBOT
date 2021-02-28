# COOBOT
An ASP.NET web application which recommends students suitable Coop vacancies from LinkedIn based on analysis done on their resumes by IBM's AI Watson.


**IMPORTANT UPDATE!**
This application uses Watson's Personality Insights service which has been set on the road to become deprecated. From the official IBM Cloud: "IBM will begin sunsetting IBM Watson Personality Insights on 1 December 2020. For a period of one year from this date, you will still be able to use Personality Insights. However, as of 1 December 2021, the offering will no longer be available."

**OVERVIEW**

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


**CONCEPT**

- About 200 student resumes served as dataset** to train a custom Watson NLU model to extract location, major, and highlight/infer interpersonal and technical skills.
- About 300 coop/internship vacancies in KSA were scraped from LinkedIn***. This data includes: name of position, city, company, link to the vacancy on LinkedIn, description and date posted.
- The data, in JSON format, was then uploaded to Watson Discovery's on-cloud corpus, and enriched with NLU analysis from a customized instance of Watson NLU, extracting key concepts and keywords such as required major, required skills set and location. The data was also run through Personality Analysis to obtain an idea about the needs and values represented in the coop/internship description. Both analysis will be later compared with the one done on the resumes. 
- Student uploads their CV/resume and/or a cover letter to COOBOT, the letter is optional but including it will help Personality Insights give better analysis regarding student's personality, needs and values. 
- The application extracts the text from said documents, then show it to the user for validation, as the process of extracting text (especially from PDF) is not optimal, and providing Watson with unsanitized data might pose a risk of obtaining inaccurate results/analysis. 
- The extraced text is then sent in pure text form to Personality Insights and NLU, the former returns analysis regarding student's Big 5 Personality Traits as well as their needs and values from the way they express themselves in written text. The latter, NLU, mainly analyzes resume text to obtain certian concepts, keywords, and other entities such as major, degree, technical and interpersonal skills that are outright mentioned or inferred from text. This is done by a custom instance of Watson NLU, which we trained to parse and understand the domain language of student resumes and job/coop/internship descriptions. 
- Finally, the application strings NLU results in a query format accepted by Watson Discovery, which returns the required coop/internship data based on the parameters provided. Each is tagged with a score representing Watson's confidence of how relevent the returned data is to the sent query.  
- The returned response is then visualized in order of relevance, and students can see how much they match with each of the recommended opportunities via charts. 


**NOTE**

Please consider, this is just the source code and very backbone of the application which must be hosted locally on Miscrosoft IIS in order to run, minus of course sensitive credentials such as Watson services' API keys. If you would like to run and try it for yourself, first create your own instances of the aformentioned Watson services and plug your own API keys into "appsettings.json". Then go through the following steps: 

To run the application, kindly follow the steps to host the application on Microsoft IIS (Internet Information Services): 

1- If not already installed, enable IIS from Control Panel > Switch to Category View > Programs > Turn Windows Features ON or OFF > Locate IIS in the Windoes Feature dialog box and enable it. 

2- Install IIS module called "URL Rewrite" from "https://www.iis.net/downloads/microsoft/url-rewrite". (please make sure to scroll down to Download URL Rewrite Module 2.1). (Since the application is single-page and runs React to generate html components on the fly with logical routing, this module is needed to force the server to always redirect to the only html page available instead of trying to look for inexistent pages)

3- Download and install .NET Core 3.1 Microsoft IIS Hosting bundle from "https://dotnet.microsoft.com/download/dotnet-core/3.1" (can be located on the right side under ASP.NET Core Runtime 3.1.10, please make sure you download Hosting Bundle.)

4- Install MS SQL Server Express from "https://www.microsoft.com/en-sa/sql-server/sql-server-downloads?SilentAuth=1&wa=wsignin1.0" as well as MS SQL Server Management Studio from "https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15".

5- After establishing a connection to the server, please make note of your username and password, then create an empty database called "COOBOT". 

6- From the folder "published" attached in this zip, navigate to "published" -> "migrations", locate an executable (.exe) file named "COOBOT.Migrator.exe" and run it. (command line will open asking you to confrim, just type "y" and enter) make sure are migrations are applied.

7- In the folder "published", navigate to "published" -> "migrations", locate a file named "appsettings.json", open it and change "ConnectionStrings" such that it matches your own SQL server credentials. Do the same in the appsettings.json file in "published" -> "coobot-api" folder as well. 

8- Open the file attached in this zip called "PopulateCoopPersonalityInsights.sql" in SQL Management Studio and execute the query. 

9- After execution is successful, copy folders "coobot" and "coobot-api" from folder "published" into this directory "C:/inetpub/wwwroot"

10- open IIS Manager, on the left pane, you will see "YourComputerName(YourComputerName\YourUserName)" expand it, then expand Sites, and then Default Web Site.

11- In Default Web Site, you should be able to see the two folders you moved, "coobot-api" and "coobot".

12- Right click on each and select "convert to application".

13- Finally, run the app by selecting "coobot" and choosing "Browse *:80 (HTTP) fomr the right side pane, or just type "localhost:/coobot/" as URL in your browser. (preferrably Chrome, but certainly not IE as the application uses modern javascript that does not run properly on IE)


**SCREENSHOTS** 

![Screenshot 2020-12-14 222220](https://user-images.githubusercontent.com/46668566/109413759-2c5e6e80-79c0-11eb-8dc4-a9c27144cd8e.png)
![Screenshot 2020-12-14 222132](https://user-images.githubusercontent.com/46668566/109413761-31232280-79c0-11eb-9f40-a83093fa8f25.png)
![Screenshot 2020-12-14 223252](https://user-images.githubusercontent.com/46668566/109413767-37190380-79c0-11eb-9d30-4c366e11af31.png)
![Screenshot 2020-12-15 001254](https://user-images.githubusercontent.com/46668566/109413772-3bddb780-79c0-11eb-82b7-8af5d8ae4b17.png)
![Screenshot 2020-12-14 224845](https://user-images.githubusercontent.com/46668566/109413782-40a26b80-79c0-11eb-8d29-93c885495466.png)
![Screenshot 2020-12-14 224956](https://user-images.githubusercontent.com/46668566/109413786-48faa680-79c0-11eb-9fdb-f49f830860d1.png)
![pi](https://user-images.githubusercontent.com/46668566/109413793-5152e180-79c0-11eb-88e6-fd2f8bce3589.png)
![Screenshot 2020-12-14 225323](https://user-images.githubusercontent.com/46668566/109413798-5c0d7680-79c0-11eb-9e5b-cf32fff11990.png)
![Screenshot 2020-12-14 225523](https://user-images.githubusercontent.com/46668566/109413800-60399400-79c0-11eb-8020-45b098df2ddc.png)



**RESOURCES**

1. ** The training dataset (student resumes) was obtained from: https://www.kaggle.com/maitrip/resumes
2. *** The Javascript scraper used: : https://github.com/spinlud/linkedin-jobs-scraper



