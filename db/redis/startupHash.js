const { MongoClient } = require('mongodb');
const redis = require('redis');

async function startupHashMap() {
    const uri = "mongodb+srv://mesiamihir:J5HLGDh488SisJek@cluster0.begu2sk.mongodb.net/?retryWrites=true&w=majority";
    
    const client = new MongoClient(uri);

    const redisClient = redis.createClient();

    redisClient.on('error', (err) => {
        console.log('Redis Client Error', err);
    });

   

  try {
    await client.connect();
    await redisClient.connect();
    
    const database = client.db("test");
    const startups = database.collection("Startups");

    
    const allStartups = await startups.find({}).toArray();

    for (const startup of allStartups) {
        const startup_id = startup._id.toString();
        await redisClient.hSet(`startup:${startup_id}`, {
          'startup_id': startup_id,
            'name':startup.startupDetails.name, 
            'category':startup.startupDetails.category,
            'fundingTotal':startup.startupDetails.fundingTotal,
            'status':startup.startupDetails.status
               
        });
    }

    

    
    

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    await redisClient.quit();
   
  }
}

startupHashMap()
