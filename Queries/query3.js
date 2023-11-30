//This query performs a lookup to join data from the founders collection into the startups collection.



const { MongoClient } = require('mongodb');

async function query3() {
    const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("test");
        const startups = db.collection("Startups");

        const result = await startups.aggregate([
            { $lookup: {
              from: "Founders",
              localField: "founders", // Remove $oid and use just the field name
              foreignField: "_id",
              as: "founderDetails"
            }},
            { $unwind: "$founderDetails" },
            { $project: { "startupDetails.name": 1, "founderDetails.founderDetails.founderName": 1 } }
          ]).toArray();

        return result;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function main() {
    const result = await query3();
    console.log(result);
}

main();
