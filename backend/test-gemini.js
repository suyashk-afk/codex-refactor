// Quick test to verify Gemini API works
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY not found in .env file");
  console.log("Please add your API key to backend/.env file:");
  console.log("GEMINI_API_KEY=your_key_here");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    console.log("Listing available models...\n");
    
    // Try to list models
    const models = await genAI.listModels();
    console.log("Available models:");
    models.forEach(model => {
      console.log(`- ${model.name}`);
    });
  } catch (error) {
    console.log("Could not list models:", error.message);
  }
}

async function testGemini() {
  // First list models
  await listModels();
  
  console.log("\n--- Testing different model names ---\n");
  
  const modelsToTry = [
    "gemini-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "models/gemini-pro",
    "models/gemini-1.5-pro"
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${result.response.text()}\n`);
      break; // Stop after first success
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}\n`);
    }
  }
}

testGemini();
