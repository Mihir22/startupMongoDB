//This query finds startups that have received more than a specified amount of funding and groups them by category, sorting by the average funding in descending order.



const { MongoClient } = require('mongodb');

async function query4() {
    const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("test");
        const startups = db.collection("Startups");

        const result = await startups.aggregate([
            { $match: { "startupDetails.fundingTotal": { $gt: 50000000 } } },
            { $group: {
              _id: "$startupDetails.category",
              averageFunding: { $avg: "$startupDetails.fundingTotal" }
            }},
            { $sort: { averageFunding: -1 } }
          ]).toArray();

        return result;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function main() {
    const result = await query4();
    console.log(result);
}

main();
