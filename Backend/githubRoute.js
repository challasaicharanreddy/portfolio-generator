import express from 'express';
import axios from 'axios';
import multer from 'multer';
import { createRequire } from 'module';
import path from "path";
import fs from "fs";
import {
  parseResumeWithGemini
} from "./services/geminiService.js";


const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/generate-portfolio', upload.single('resumeFile'), async (req, res) => {
  // Inside your router.post('/generate-portfolio', ...)
  const username = req.body.username || req.body.githubUser;
  const linkedinUrl = req.body.linkedinUrl;
  let linkedinHandle = "";
let linkedinName = "";

if (linkedinUrl) {
  const match = linkedinUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);

  if (match) {
    linkedinHandle = match[1];

    // Remove LinkedIn ID suffix like -6112b32b8
    const cleanHandle = linkedinHandle.replace(/-[a-z0-9]{8,}$/i, "");

    linkedinName = cleanHandle
      .split("-")
      .filter(Boolean)
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }
}
  const resumeFile = req.file; // This initializes resumeFile safely!

  // 2. NOW IT IS SAFE TO RUN LOGS AND LOGIC
  console.log("--- New Request Received ---");
  console.log(`Processing portfolio for user: ${username}`);
  if (resumeFile) {
    console.log(`Received file cleanly: ${resumeFile.originalname}`);
  }

  if (!username) {
    return res.status(400).json({ error: "GitHub username is required" });
  }

  let parsedResume = {
    name: "",
    email: "",
    skills: [],
    education: [],
    experience: [],
    certifications: []
  };

  try {
    console.log(`Processing data for: ${username}`);

    // 3. If a resume PDF exists, parse its raw text buffer
    if (resumeFile) {
      console.log("Parsing uploaded resume PDF buffer...");
  
      const pdfBuffer = fs.readFileSync(
        resumeFile.path
      );
  
      const pdfData =
        await pdfParse(pdfBuffer);
  
      const rawText = pdfData.text;
  
      const geminiResponse =
        await parseResumeWithGemini(rawText);
  
      console.log("Gemini Response:");
      console.log(geminiResponse);
      try {
        const cleanResponse = geminiResponse
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
      
        parsedResume = JSON.parse(cleanResponse);
      
        console.log("Parsed Resume:");
        console.log(parsedResume);
      
      } catch (err) {
        console.error(
          "Failed to parse Gemini JSON:",
          err
        );
      }
      try {
        parsedResume = JSON.parse(
          geminiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim()
        );
      } catch (err) {
        console.error(
          "Failed to parse Gemini JSON:",
          err
        );
      }
    }

    // 4. Fetch GitHub details as usual
    const axiosConfig = { headers: { 'User-Agent': 'Portfolio-Generator-Agent' } };
    const [profileResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, axiosConfig),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, axiosConfig)
    ]);

    const profile = {
      name:parsedResume.name ||linkedinName ||profileResponse.data.name ||username,
      about: parsedResume.about || "",
      avatar: profileResponse.data.avatar_url,
      bio: profileResponse.data.bio || "Full Stack Developer",
      location: profileResponse.data.location || "",
      blog: profileResponse.data.blog || "",
      html_url: profileResponse.data.html_url,
      linkedin_url: linkedinUrl || "",
      linkedin_handle: linkedinHandle,
      linkedin_name: linkedinName,
      has_resume: !!resumeFile,
      resume_url: resumeFile
      ? `${process.env.BASE_URL}/uploads/${resumeFile.filename}`
      : "",
        skills: parsedResume.skills || [],
        education:
          parsedResume.education || [],
        experience:
          parsedResume.experience || [],
        certifications:
          parsedResume.certifications || [],
        contact_email:
          parsedResume.email || ""
      // education: extractedEducation,
    };

    const repos = reposResponse.data
      .filter(repo => !repo.fork)
      .map(repo => ({
        name: repo.name,
        description: repo.description || "No description provided.",
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language || "JavaScript",
      }));
      const totalStars = repos.reduce(
        (sum, repo) => sum + repo.stars,
        0
      );
      
      const languages = [
        ...new Set(
          repos
            .map(repo => repo.language)
            .filter(Boolean)
        )
      ];
      
      const stats = {
        totalRepos: repos.length,
        totalStars,
        totalLanguages: languages.length,
        languages
      };
      console.log("GitHub Stats:", stats);
    return res.json({ profile, repos, stats });

  } catch (error) {
    console.error("Pipeline Failure:", error.message);
    return res.status(500).json({ error: "Failed to compile developer profile data." });
  }
});

export default router;