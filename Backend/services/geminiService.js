import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("Gemini Key:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

export async function parseResumeWithGemini(rawText) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
  You are a resume parser.

  Return ONLY valid JSON.
  
  Generate a professional About Me section in 2-3 sentences.
  
  Schema:
  
  {
    "name": "",
    "email": "",
    "about": "",
    "skills": [],
    "education": [],
    "experience": [],
    "certifications": []
  }
  
  Resume:
  
  ${rawText}
  `;
  
  const result =
    await model.generateContent(prompt);
  
  return result.response.text();
}