//This query aggregates startups by category, 
// calculating the total funding and the count of startups in each category.
const { MongoClient } = require('mongodb');

async function assignInvestorsToStartups() {
    const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    
    const client = new MongoClient(uri);
   

  try {
    await client.connect();
    const db = client.db("test");
    const startups = db.collection("Startups")
    
    const result = await startups.aggregate([
        { $group: {
          _id: "$startupDetails.category",
          totalFunding: { $sum: "$startupDetails.fundingTotal" },
          startupCount: { $sum: 1 }
        }}
      ]).toArray();
      return result

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

async function main() {
    const result = await assignInvestorsToStartups();
    console.log(result);
}

main();