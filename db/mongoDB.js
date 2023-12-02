const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

sqlite3.verbose();

async function connect() {
  const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    
  const client = new MongoClient(uri);

  return client.connect();

 
}

async function getStartup() {
  const client = await connect();
  const db = client.db("test");
  const startups = db.collection("Startups");
  try {
    return await startups.find().toArray();
  } finally {
    // await db.close();
  }
  
}



async function getInstInvestors() {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");
  return await investors.find({ investorType: "Institutional" }).toArray();
  } 




async function getIndiInvestors() {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");
  return await investors.find({ investorType: "Individual" }).toArray();
}


async function createStartup(newStartup) {
  const client = await connect();
  const db = client.db("test");
  const startups = db.collection("Startups");
  try {
    
    const startupDocument = {
      startupDetails: {
        name: newStartup.name,
        category: newStartup.category,
        fundingTotal: newStartup.fundingTotal,
        status: newStartup.status
      },
      founders: [],  
      investors: [], 
      fundingRound: [] 
    };

    
    return await startups.insertOne(startupDocument);
  } finally {
    
  }
}


async function createInstInvestor(investor) {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");
  try {
    
    const investorDocument = {
      
        investorType: "Institutional",
        commonDetails : {
          name: investor.name,
          contactInfo: investor.contactInfo,
          country: investor.country,
        },
        institutionalDetails: {
          foundingDate: investor.foundingDate,
          numberOfMembers: investor.numberOfMembers,
          assetUnderManagement: investor.assetUnderManagement
        }
        
    };

    
    return await investors.insertOne(investorDocument);
  } finally {
    
  }
  
}

async function createIndiInvestor(investor) {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");
  console.log(investor);
  try {
    
    const investorDocument = {
      
      investorType: "Individual",
      commonDetails : {
        name: investor.name,
        contactInfo: investor.contactInfo,
        country: investor.country,
      },
      institutionalDetails: {
        birthDate: investor.birthDate,
        netWorth: investor.netWorth
      }
      
    };

    
    return await investors.insertOne(investorDocument);
  } finally {
    
  }
  
}

async function getStartupByID(idString) {
  const client = await connect();
  const db = client.db("test");
  const startups = db.collection("Startups");
  try {
    
    const id = new ObjectId(idString);

   
    return await startups.findOne({ _id: id });
  } catch (error) {
    
    console.error("Error finding investor:", error);
    return null;
  } finally {
    
  }
}

async function deleteStartup(startupID) {
  
  const client = await connect();
  const db = client.db("test");
  const startups = db.collection("Startups");
  const investors = db.collection("Investors");

  try {
    
    const id = new ObjectId(startupID);

    
    await startups.deleteOne({ _id: id });

   
    await investors.updateMany(
      {},
      { $pull: { startup: id } }
    );
  } finally {
    
  }
}

async function updateStartup(startup) {
  const client = await connect();
  const db = client.db("test");
  const startups = db.collection("Startups");

  try {

    const id = new ObjectId(startup.startupID);
   
    const filter = {_id: id };
    const update = {
      $set: {
        "startupDetails.name": startup.name,
        "startupDetails.category": startup.category,
        "startupDetails.fundingTotal": startup.fundingTotal,
        "startupDetails.status": startup.status
      }
    };

    
    return await startups.updateOne(filter, update);
  } finally {
    
  }
}


async function deleteInvestor(investorID) {
  const client = await connect();
  const db = client.db("test");
  const startups = db.collection("Startups");
  const investors = db.collection("Investors");

  try {
    
    const id = new ObjectId(investorID);

    
    await investors.deleteOne({ _id: id });

   
    await startups.updateMany(
      {},
      { $pull: { investors: id } }
    );
  } finally {
    
  }
 
}

async function getInstInvestorByID(idString) {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");
  try {
    
    const id = new ObjectId(idString);

    console.log("Reached here!")
   
    return await investors.findOne({ _id: id });
  } catch (error) {
    
    console.error("Error finding investor:", error);
    return null;
  } finally {
    
  }
  
}

async function getIndInvestorByID(idString) {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");
  try {
    
    const id = new ObjectId(idString);

   
    return await investors.findOne({ _id: id });
  } catch (error) {
    
    console.error("Error finding investor:", error);
    return null;
  } finally {
    
  }
  
}


async function updateInstInvestorByID(investor) {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");

  try {
    
    const id = new ObjectId(investor.investorID);

    
    const update = {
      $set: {
        "commonDetails.name": investor.name,
        "commonDetails.contactInfo": investor.contactInfo,
        "commonDetails.country": investor.country,
        "institutionalDetails.foundingDate": investor.foundingDate,
        "institutionalDetails.numberOfMembers": investor.numberOfMembers,
        "institutionalDetails.assetUnderManagement": investor.assetUnderManagement
      }
    };

    console.log("reached");
    return await investors.updateOne({ _id: id }, update);
  } finally {
    
  }
}

async function updateIndInvestorByID(investor) {
  const client = await connect();
  const db = client.db("test");
  const investors = db.collection("Investors");

  try {
    // Convert the string id to a MongoDB ObjectId
    const id = new ObjectId(investor.investorID);

    // Construct the update object to modify both common and institutional investor details
    const update = {
      $set: {
        "commonDetails.name": investor.name,
        "commonDetails.contactInfo": investor.contactInfo,
        "commonDetails.country": investor.country,
        "institutionalDetails.birthDate": investor.birthDate,
        "institutionalDetails.netWorth": investor.netWorth
      }
    };

    // Update the document
    return await investors.updateOne({ _id: id }, update);
  } finally {
    // You can handle any cleanup or closing of connections here if needed
  }

  
}






module.exports.getStartup = getStartup;
module.exports.createStartup = createStartup;
module.exports.deleteStartup = deleteStartup;
module.exports.getStartupByID = getStartupByID;
module.exports.updateStartup = updateStartup;
module.exports.getInstInvestors = getInstInvestors;
module.exports.deleteInvestor = deleteInvestor;
module.exports.getIndiInvestors = getIndiInvestors;
module.exports.createInstInvestor = createInstInvestor;
module.exports.createIndiInvestor = createIndiInvestor;
module.exports.getInstInvestorByID = getInstInvestorByID;
module.exports.updateInstInvestorByID = updateInstInvestorByID;
module.exports.updateIndInvestorByID = updateIndInvestorByID;
module.exports.getIndInvestorByID = getIndInvestorByID;