import mongoose from "mongoose";

// Define the Embedding Schema
const EmbeddingSchema = new mongoose.Schema({
  text: { type: String, required: true },  // Store the original text or document
  vector: { type: [Number], required: true }, // Embedding vector (an array of numbers)
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

// Create and export the Mongoose model
export const Embedding = mongoose.model("Embedding", EmbeddingSchema);
