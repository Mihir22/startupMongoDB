const { MongoClient } = require('mongodb');
const redis = require('redis');

async function investsHashMap() {
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
    const investors = database.collection("Investors");

    
    const allInvestors = await investors.find({}).toArray();

    for (const investor of allInvestors) {
        const name = investor.commonDetails.name;
        const startup = investor.startup;
        if (Array.isArray(startup)) {
            for (const s_id of startup) {
                const s_id_str = s_id.toString(); 
                await redisClient.SADD(`investments:${name}`, s_id_str);
            }
        } else {
            
            console.log(`Investor ${name} has a non-iterable startup field:`, startup);
        }
    }

    console.log("investments mapped");

    
    

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    await redisClient.quit();
   
  }
}

investsHashMap()
