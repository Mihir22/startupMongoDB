const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

function transformId(item) {
    if (item._id && item._id.$oid) {
        item._id = new ObjectId(item._id.$oid);
    }
    return item;
}

async function addData() {
    const url = process.env.MONGO_URL; // add your mongo url
    const client = new MongoClient(url);

    try {
        const dbName = 'trial'; // your database name
        const jsonFiles = ['./data/Founders.json', './data/FundingRounds.json', './data/Investors.json', './data/Startups.json'];
        const fileNames = ['Founders', 'FundingRounds', 'Investors', 'Startups'];

        await client.connect();
        const db = client.db(dbName);

        for (let i = 0; i < jsonFiles.length; i++) {
            const file = jsonFiles[i];
            const collectionName = fileNames[i];
            const collection = db.collection(collectionName);

            try {
                const data = await readFile(file, 'utf8');
                let items = JSON.parse(data);
                items = items.map(transformId);
                const result = await collection.insertMany(items);
                console.log(`Inserted ${result.insertedCount} documents into collection: ${collectionName}`);
            } catch (err) {
                console.error(`Error processing file ${file}:`, err);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

addData();
