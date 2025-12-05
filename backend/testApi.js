// testApi.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-live" });
  
  const result = await model.generateContent("why i'm feeling anxios today");
  const response = await result.response;
  console.log(response.text());
}

main();