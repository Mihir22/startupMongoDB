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
4. Create, edit, delete both type of Investors 
5. View all the investments by individual investor.
6. Invest in different startups. (Redis).
7. Delete investements (Redis).

## Installation

1) Clone the repository
2) `npm install`
3)  cd to db
4) In the intializeData.js add your mongo url and database name
5) run command "node initializeData.js"
6) This will create 4 collections
7) cd to redis
8) run command "node investsHashMap.js"
9) run command "node statupHash.js"
10) npm start

## Screen Shots
<img width="1508" alt="Screenshot 2023-12-11 at 3 50 22 PM" src="https://github.com/Mihir22/startupMongoDB/assets/44001096/33784fd9-18ce-43f2-8f90-6bc60ff7cbd1">

<img width="1504" alt="Screenshot 2023-12-11 at 3 49 40 PM" src="https://github.com/Mihir22/startupMongoDB/assets/44001096/0cbc17f6-c515-41ee-b172-58959d0ad9d5">

<img width="1269" alt="Screenshot 2023-12-11 at 2 16 16 PM" src="https://github.com/Mihir22/startupMongoDB/assets/44001096/e361e1ee-1a14-4671-b6cc-41ef4b7e2bf3">


### Note for Node app (Redis part)
1) Click on investors
2) Click on investments on any investor card
3) You can view the invetments
4) Click on any radiobutton beside the startup name
5) Scroll down to the end of the page and click "submit"
6) This will create new investments
7) To delete investments click on the "Delete" button after the startup you want to delete.


