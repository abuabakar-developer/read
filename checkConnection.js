const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URL || "mongodb+srv://mu712576:trymCnCJnN8MC1jg@cluster0.hqrrotr.mongodb.net/bookstore?retryWrites=true&w=majority&appName=Cluster0"; // Your MongoDB connection string

async function checkConnection() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {                                                
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    
    const db = client.db("bookstore"); // Database name
    const collections = await db.collections();
    console.log("Collections in the database:", collections.map(col => col.collectionName));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}
                      
checkConnection();    

    
 



