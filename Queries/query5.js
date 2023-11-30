//This query updates the status of all startups that have a funding total greater than a specific amount to "Successful".



const { MongoClient } = require('mongodb');

async function query5() {
    const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("test");
        const startups = db.collection("Startups");

        const result = await startups.updateMany(
            { "startupDetails.fundingTotal": { $gt: 100000000 } },
            { $set: { "startupDetails.status": "Successful" } }
          )
          

        return result;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function main() {
    const result = await query5();
    console.log(result);
}

main();
