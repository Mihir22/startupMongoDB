//This query lists each investor along with the number of startups they have invested in.

const { MongoClient } = require('mongodb');

async function query2() {
    const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("test");
        const investors = db.collection("Investors");

        const result = await investors.aggregate([
            {
                $project: {
                    "commonDetails.name": 1,
                    numberOfInvestments: { $size: { $ifNull: ["$startup", []] } }
                }
            }
        ]).toArray();

        return result;
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

async function main() {
    const result = await query2();
    console.log(result);
}

main();
