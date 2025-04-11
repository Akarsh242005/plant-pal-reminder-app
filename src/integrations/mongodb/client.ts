
import { MongoClient, ServerApiVersion } from 'mongodb';

// Connection URI
const uri = "mongodb://localhost:27017";

// Create a MongoClient with connection options
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database Name
export const dbName = 'plantpalDB';

// Connect to MongoDB
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    return client.db(dbName);
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectFromMongoDB() {
  try {
    await client.close();
    console.log("Disconnected from MongoDB server");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}
