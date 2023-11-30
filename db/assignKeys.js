const { MongoClient } = require('mongodb');

async function assignInvestorsToStartups() {
    const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    
    const client = new MongoClient(uri);
   

  try {
    await client.connect();
    const database = client.db("test");
    const startups = database.collection("Startups");
    const investors = database.collection("Investors");

    const allStartups = await startups.find({}).toArray();
    const allInvestors = await investors.find({}).toArray();

    // Assign a random subset of investors to each startup
    for (const startup of allStartups) {
      const assignedInvestors = allInvestors.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, allInvestors.length));
      
      const assignedInvestorIds = assignedInvestors.map(investor => investor._id);
      
      await startups.updateOne({ _id: startup._id }, { $addToSet: { investors: assignedInvestorIds } });

     
      for (const investorId of assignedInvestorIds) {
        await investors.updateOne({ _id: investorId }, { $addToSet: { startup: startup._id } });
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}


async function assignFoundersToStartups() {
  const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
  
  const client = new MongoClient(uri);
 

try {
  await client.connect();
  const database = client.db("test");
  const startups = database.collection("Startups");
  const founders = database.collection("Founders");

  const allStartups = await startups.find({}).toArray();
  const allFounders = await founders.find({}).toArray();

  // Assign a random subset of investors to each startup
  for (const startup of allStartups) {
    const assignedFounders = allFounders.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, allFounders.length));
    
    const assignedFounderIds =  assignedFounders.map(investor => investor._id);
   
    for (const founderId of assignedFounderIds) {
      await startups.updateOne({ _id: startup._id }, { $addToSet: { founders: founderId } });
    }
  }

} catch (err) {
  console.error(err);
} finally {
  await client.close();
}
}


async function assignFundingRoundsToStartups() {
  const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
  
  const client = new MongoClient(uri);
 

try {
  await client.connect();
  const database = client.db("test");
  const startups = database.collection("Startups");
  const fundingRounds = database.collection("FundingRounds");

  const allStartups = await startups.find({}).toArray();
  const allRounds = await fundingRounds.find({}).toArray();

  
  for (const startup of allStartups) {
    const assignedRounds = allRounds.sort(() => 0.5 - Math.random()).slice(0, Math.min(5, allRounds.length));
    
    const assignedRoundIds = assignedRounds.map(round => round._id);


    for (const roundIds of assignedRoundIds) {
      await startups.updateOne({ _id: startup._id }, { $addToSet: { fundingRound: roundIds } });
    }
    
    

   
    for (const roundIds of assignedRoundIds) {
      await fundingRounds.updateOne({ _id: roundIds }, { $addToSet: { participatingStartups: startup._id } });
    }
  }

} catch (err) {
  console.error(err);
} finally {
  await client.close();
}
}

async function moveInvestors() {
  const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
  
  const client = new MongoClient(uri);
 

try {
  await client.connect();
  const database = client.db("test");
  const startups = database.collection("Startups");

  
  const cursor = await startups.find({ "investors": { $elemMatch: { $type: "array" } } })
  for await (const doc of cursor) {
    const flattenedArray = doc.investors.flat();
    await startups.updateOne({ _id: doc._id }, { $set: { investors: flattenedArray } });
  }

} catch (err) {
  console.error(err);
} finally {
  await client.close();
}
}


assignInvestorsToStartups();
assignFoundersToStartups();
assignFundingRoundsToStartups();


