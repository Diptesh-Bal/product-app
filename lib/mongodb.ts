// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Ensures `global` has a type for our client promise
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB connection failed in development mode:", err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection for each invocation
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB connection failed in production mode:", err);
    throw err;
  });
}

export default clientPromise;
