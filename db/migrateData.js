const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { MongoClient, ObjectId } = require('mongodb');

sqlite3.verbose();

async function connect() {
  return open({
    filename: "Startup.db",
    driver: sqlite3.Database,
  });

 
}

async function main() {
    const uri = process.env.MONGO_URL;
    
    const client = new MongoClient(uri);
    const db = await connect();

    try {
        await client.connect();
        // await migrateData(client, db);
         await addKeys(client,db);
        
        console.log("keys added successfully");
       
    } finally {
        await client.close();
    }
}

const toObjectId = (id) => new ObjectId(id.toString().padStart(24, '0'));

async function migrateData(client, database) {
  let sqlConnection;
  let mongoClient;

  try {
    // Connect to the SQL and MongoDB databases
    sqlConnection = database;
    mongoClient = client;
    const db = mongoClient.db();

    // Start the migration process for each table

    // Migrate Startups
    const startups = await sqlConnection.all('SELECT * FROM Startup');
    const startupDocuments = startups.map((startup) => ({
      _id: toObjectId(startup.startupID),
      startupDetails: {
        name: startup.name,
        category: startup.category,
        fundingTotal: startup.fundingTotal,
        status: startup.status,
      },
      founders:[],
      investors:[],
      fundingRound: []
    }));
    await db.collection('Startups').insertMany(startupDocuments);

    // Migrate Founders
    const founders = await sqlConnection.all('SELECT * FROM Founder');
    const founderDocuments = founders.map((founder) => ({
      _id: toObjectId(founder.founderID), 
      founderDetails: {
        founderName: founder.founderName,
        birthDate: founder.birthDate,
        nationality: founder.nationality
      }
    }));
    await db.collection('Founders').insertMany(founderDocuments);

    // Migrate Institutional Investors
    const institutionalInvestors = await sqlConnection.all('SELECT * FROM INVESTOR a INNER JOIN InstitutionalInvestor b ON a.investorID = b.investorID');
    let investorDocuments = institutionalInvestors.map((investor) => ({
      _id: toObjectId(investor.investorID), 
      commonDetails : {
        name: investor.name,
      contactInfo: investor.contactInfo,
      country: investor.country
      },
      investorType:"Institutional",
      institutionalDetails: {
        foundingDate: investor.foundingDate,
        numberOfMembers: investor.numberOfMembers,
        assetUnderManagement: investor.assetUnderManagement
      },
      startup: []
      
     
    }));
    await db.collection('Investors').insertMany(investorDocuments);

    // Migrate Individual Investors
    const individualInvestors = await sqlConnection.all('SELECT * FROM INVESTOR a INNER JOIN IndividualInvestor b ON a.investorID = b.investorID');
    investorDocuments = individualInvestors.map((investor) => ({
      _id: toObjectId(investor.investorID), 
      commonDetails : {
        name: investor.name,
      contactInfo: investor.contactInfo,
      country: investor.country
      },
      investorType:"Individual",
      institutionalDetails: {
        birthDate: investor.birthDate,
        netWorth: investor.netWorth
      },
      startup: []
      
     
    }));
    await db.collection('Investors').insertMany(investorDocuments);


    // Migrate Funding Rounds
    const fundingRounds = await sqlConnection.all('SELECT * FROM FundingRound f LEFT JOIN Venue v ON f.venueID = v.venueID');
    const fundingRoundDocuments = fundingRounds.map((fundingRound) => ({
      _id: toObjectId(fundingRound.roundID), // Simulate ObjectId using roundID
      fundingRoundDetails: {
        fundingRoundType: fundingRound.fundingRoundType,
        fundingRoundDate: fundingRound.fundingRoundDate,
        typeOfEvent: fundingRound.typeOfEvent
      },
      venue: {
        venueName: fundingRound.venueName,
        location: fundingRound.location
      },
      participatingStartups: []
    }));
    await db.collection('FundingRounds').insertMany(fundingRoundDocuments);


    console.log('Data migration complete.');
  } catch (err) {
    console.error('An error occurred during migration:', err);
  } finally {
    // if (sqlConnection) {
    //   await sqlConnection.end();
    // }
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

async function addKeys(client, database) {
  let sqlConnection;
  let mongoClient;

  try {
    // Connect to the SQL and MongoDB databases
    sqlConnection = database;
    mongoClient = client;
    const db = mongoClient.db();

    const foundedByRecords = await sqlConnection.all('SELECT * FROM FoundedBy');
    for (const record of foundedByRecords) {
      await db.collection('Startups').updateOne(
        { _id: toObjectId(record.startupID) },
        { $addToSet: { founders: toObjectId(record.founderID) } }
      );
    }

    const investors = await sqlConnection.all('SELECT * FROM InvestsIn');
    for (const record of investors) {
      await db.collection('Startups').updateOne(
        { _id: toObjectId(record.startupID) },
        { $addToSet: { investors: toObjectId(record.investorID) } }
      );
    }

    for (const record of investors) {
      await db.collection('Investors').updateOne(
        { _id: toObjectId(record.investorID) },
        { $addToSet: { startup: toObjectId(record.startupID) } }
      );
    }

    const fundingRound = await sqlConnection.all('SELECT * FROM Participates');
    for (const record of investors) {
      await db.collection('Startups').updateOne(
        { _id: toObjectId(record.startupID) },
        { $addToSet: { fundingRound: toObjectId(record.investorID) } }
      );
    }


  } catch (err) {
    console.error('An error occurred during migration:', err);
  } finally {
    // if (sqlConnection) {
    //   await sqlConnection.end();
    // }
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

main();