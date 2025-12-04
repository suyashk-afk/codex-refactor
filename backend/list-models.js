// List all available Gemini models for your API key
const axios = require('axios');

const API_KEY = "AIzaSyDF35412Fdpgu7y9yc1ncWtPFyxDNy2IsY"; // Replace with your actual key

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
