# Global Startup Database

### Objective:
To design and implement a comprehensive database for capturing the intricacies of the global startup ecosystem, highlighting relationships between startups, investors, countries, and founders.


### Scope:
The database will focus on:
1. Startups and their various attributes such as category, funding, and status.
2. Investors and their types, emphasizing the difference between individual and institutional investors.
3. Funding Rounds that capture the investment relationships.
4. Countries as primary geographical entities to associate startups and investors.
5. Founders, detailing their background and associations with startups

### Node + Express App:
This app will let you do the following

1. View all the startups.
2. Create, edit, delete startups.
3. View all the investors.
4. Create, edit, delete both type of Investors (Institutional, Individual) (Foreign Key).
5. View all the investments by individual investor.
6. Invest in different startups. (Foreing Key).


### How to initialize data
1. git clone the project
2. cd to db
3. In the intializeData.js add your mongo url and database name
4. run command "node initializeData.js"
5. This will create 4 collections


### How to run the queries
1. cd to Queries folder
2. In every js file inside the folder replace your mongo url
3. run each query using "node query1.js"

## Installation

1) Clone the repository
2) `npm install`
3) `npm start`
