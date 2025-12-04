// Quick test to verify Gemini API works
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCZ3G46vcvXAUN9ZVHJwGc8K7Uc_TNSzc0");

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
