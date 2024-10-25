import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DataAPIClient } from "@datastax/astra-db-ts"; // Retained for embeddings collection

const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
const collection = process.env.ASTRA_DB_COLLECTION;
const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

// Ensure all required environment variables are set
if (!token || !collection || !endpoint) {
  throw new Error("Please set the following environment variables: ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT");
}

// This function is retained for embeddings collection
export async function getEmbeddingsCollection() {
  const client = new DataAPIClient(token as string); // Assert token is a string
  const db = client.db(endpoint as string); // Assert endpoint is a string

  return db.collection(collection as string); // Assert collection is a string
}

// Remove the getVectorStore function as it is no longer needed
