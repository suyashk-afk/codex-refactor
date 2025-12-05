// List all available Gemini models for your API key
require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY not found in .env file");
  console.log("Please add your API key to backend/.env file:");
  console.log("GEMINI_API_KEY=your_key_here");
  process.exit(1);
}

async function listModels() {
  try {
    console.log("Fetching available models...\n");
    
    // Try v1beta
    console.log("=== V1BETA API ===");
    const v1beta = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    console.log("Available models in v1beta:");
    v1beta.data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supports: ${model.supportedGenerationMethods.join(', ')}`);
    });
    
    console.log("\n=== V1 API ===");
    // Try v1
    const v1 = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    
    console.log("Available models in v1:");
    v1.data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  Supports: ${model.supportedGenerationMethods.join(', ')}`);
    });
    
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

listModels();
