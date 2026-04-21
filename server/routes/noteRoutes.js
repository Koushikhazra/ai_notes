const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");
const Note = require("../models/Note");

 const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 30000);
const GEMINI_MAX_INPUT_CHARS = Number(
  process.env.GEMINI_MAX_INPUT_CHARS || 12000
);
const GEMINI_MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 2);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeText(text = "") {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function prepareTextForAI(text = "") {
  const normalizedText = normalizeText(text);

  if (normalizedText.length <= GEMINI_MAX_INPUT_CHARS) {
    return {
      text: normalizedText,
      truncated: false,
    };
  }

  return {
    text: normalizedText.slice(0, GEMINI_MAX_INPUT_CHARS),
    truncated: true,
  };
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || "";
}

 
let GEMINI_MODELS = [];
let currentModelIndex = 0;

 async function fetchAvailableModels() {
  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      console.log("GEMINI_API_KEY not found - will attempt to fetch models on first use");
      return [];
    }

    const response = await axios.get(
      "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey
    );

    const models = response.data.models || [];
    
    // Filter for models that support generateContent
    const supportedModels = models
      .filter((model) => {
        const supportedMethods = model.supportedGenerationMethods || [];
        return supportedMethods.includes("generateContent");
      })
      .map((model) => {
         return model.name.replace("models/", "");
      })
      .sort();

    if (supportedModels.length > 0) {
      console.log("Available models from ListModels API:", supportedModels);
      GEMINI_MODELS = supportedModels;
      return supportedModels;
    } else {
      console.log("No models found with generateContent support in ListModels response");
      return [];
    }
  } catch (error) {
    console.log("Error fetching models from ListModels API:", error.message);
    return [];
  }
}

function getGeminiApiUrl(modelIndex = currentModelIndex) {
  if (GEMINI_MODELS.length === 0) {
    throw new Error("No available Gemini models found. Please check your API key or try again later.");
  }
  const model = GEMINI_MODELS[modelIndex] || GEMINI_MODELS[0];
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

function getGeminiErrorMessage(error) {
  const status = error.response?.status || 500;
  const apiMessage = error.response?.data?.error?.message;

  if (status === 429) {
    return "Service is temporarily unavailable. Please try again later.";
  }

  if (status === 401) {
    return "Something went wrong with the service. Please try again later.";
  }

  if (status === 503) {
    return "Service is temporarily unavailable. Please try again later.";
  }

  if (status >= 400 && apiMessage) {
    return "Something went wrong. Please try again later.";
  }

  if (error.code === "ECONNABORTED") {
    return "Request took too long. Please try again.";
  }

  return "Something went wrong. Please try again later.";
}

function getGeminiResponseText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts
    .map((part) => part.text || "")
    .join("")
    .trim();
}

function stripCodeFences(text = "") {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJSON(text = "") {
   
  let jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  
   jsonMatch = text.match(/[\[\{][\s\S]*[\]\}]/);
  if (jsonMatch) {
    return jsonMatch[0].trim();
  }
  
   return text.trim();
}

async function extractInputText(req) {
  let uploadedFilePath = null;

  try {
    let text = req.body.text || "";

    if (req.file) {
      uploadedFilePath = req.file.path;

      if (req.file.mimetype === "application/pdf") {
        text = await extractPdfText(uploadedFilePath);
      } else {
        text = fs.readFileSync(uploadedFilePath, "utf-8");
      }
    }

    const prepared = prepareTextForAI(text);

    if (!prepared.text) {
      throw new AppError(
        "Please enter some text or upload a readable PDF/TXT file.",
        400
      );
    }

    return prepared;
  } finally {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }
  }
}

 async function extractPdfText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.log("Error extracting PDF:", error);
    return "";
  }
}
 
async function callAI(prompt) {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new AppError(
      "GEMINI_API_KEY is missing. Add GEMINI_API_KEY to server/.env and restart the server.",
      500
    );
  }

   if (GEMINI_MODELS.length === 0) {
    console.log("Models not loaded yet. Fetching from ListModels API...");
    await fetchAvailableModels();
  }

  if (GEMINI_MODELS.length === 0) {
    throw new AppError(
      "Could not fetch available Gemini models. Please check your API key and try again.",
      500
    );
  }

   for (let modelIndex = 0; modelIndex < GEMINI_MODELS.length; modelIndex++) {
    for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt += 1) {
      try {
        const response = await axios.post(
          getGeminiApiUrl(modelIndex),
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 5000,
            },
          },
          {
            headers: {
              "x-goog-api-key": apiKey,
              "Content-Type": "application/json",
            },
            timeout: GEMINI_TIMEOUT_MS,
          }
        );

        const content = getGeminiResponseText(response.data);

        if (!content) {
          throw new AppError("Gemini returned an empty response.", 502);
        }

      
        currentModelIndex = modelIndex;
        return content.trim();
      } catch (error) {
        const status = error.response?.status || 500;
        const model = GEMINI_MODELS[modelIndex];
        
         
        if (status === 503) {
          console.log(`Model ${model} is unavailable (503). Trying next model...`);
          break; // Break inner loop to try next model
        }

        const shouldRetry = status === 429 && attempt < GEMINI_MAX_RETRIES;

        if (shouldRetry) {
          const retryAfterSeconds = Number(
            error.response?.headers?.["retry-after"] || 0
          );
          const delayMs =
            retryAfterSeconds > 0
              ? retryAfterSeconds * 1000
              : 1000 * Math.pow(2, attempt);

          console.log(
            `Gemini rate limited (${model}). Retrying in ${delayMs}ms (attempt ${
              attempt + 1
            }/${GEMINI_MAX_RETRIES + 1}).`
          );

          await sleep(delayMs);
          continue;
        }

        const message =
          error instanceof AppError ? error.message : getGeminiErrorMessage(error);

        console.log("Gemini API error:", {
          model,
          status,
          message,
          details: error.response?.data?.error || error.message,
        });

     
        if (modelIndex === GEMINI_MODELS.length - 1) {
          if (error instanceof AppError) {
            throw error;
          }
          throw new AppError(message, status);
        }

        break; // Try next model
      }
    }
  }

 
  throw new AppError(
    "All Gemini models are currently unavailable. Please try again later.",
    503
  );
}

// POST: Summarize
router.post("/summarize", upload.single("file"), async (req, res) => {
  try {
    const input = await extractInputText(req);
    const text = input.text;

    // Create prompt
    const prompt = `Summarize the following text into clear bullet points. Make it concise and easy to understand:\n\n${text}`;

    const summary = await callAI(prompt);

    if (!summary || summary.trim().length === 0) {
      throw new AppError("The AI returned an empty summary. Please try again.", 502);
    }

    // Save to database
    const note = new Note({
      originalText: text,
      summary: summary,
    });

    await note.save();

    res.json({
      success: true,
      summary: summary,
      noteId: note._id,
      warning: input.truncated
        ? `Your note was trimmed to the first ${GEMINI_MAX_INPUT_CHARS} characters to stay within API limits.`
        : "",
    });
  } catch (error) {
    console.log("Summarize error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST: Explain Simply
router.post("/explain", upload.single("file"), async (req, res) => {
  try {
    const input = await extractInputText(req);
    const text = input.text;

    const prompt = `Explain this content in very simple terms like teaching a 10-year-old child. Use simple words and examples:\n\n${text}`;

    const explanation = await callAI(prompt);

    if (!explanation || explanation.trim().length === 0) {
      throw new AppError("The AI returned an empty explanation. Please try again.", 502);
    }

   
    let note = await Note.findOne({ originalText: text });
    if (note) {
      note.simpleExplanation = explanation;
      await note.save();
    } else {
      note = new Note({
        originalText: text,
        simpleExplanation: explanation,
      });
      await note.save();
    }

    res.json({
      success: true,
      explanation: explanation,
      noteId: note._id,
      warning: input.truncated
        ? `Your note was trimmed to the first ${GEMINI_MAX_INPUT_CHARS} characters to stay within API limits.`
        : "",
    });
  } catch (error) {
    console.log("Explain error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST: Generate Quiz
router.post("/quiz", upload.single("file"), async (req, res) => {
  try {
    const input = await extractInputText(req);
    const text = input.text;

    const prompt = `Generate 5 multiple choice questions from this text. For each question, provide 4 options (A, B, C, D) and the correct answer. Format it as JSON:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "A"
  }
]

Text: ${text}`;

    const quizResponse = await callAI(prompt);

     let quiz = [];
    try {
      const extractedJSON = extractJSON(quizResponse);
      quiz = JSON.parse(extractedJSON);
      
      // Validate quiz format
      if (!Array.isArray(quiz)) {
        throw new Error("Quiz response is not an array");
      }
    } catch (e) {
      console.log("Failed to parse quiz JSON:", e.message);
      console.log("Raw response was:", quizResponse);
      throw new AppError(
        "Failed to generate quiz. The AI response format was invalid. Please try again.",
        502
      );
    }

    
    let note = await Note.findOne({ originalText: text });
    if (note) {
      note.quiz = quiz;
      await note.save();
    } else {
      note = new Note({
        originalText: text,
        quiz: quiz,
      });
      await note.save();
    }

    res.json({
      success: true,
      quiz: quiz,
      noteId: note._id,
      warning: input.truncated
        ? `Your note was trimmed to the first ${GEMINI_MAX_INPUT_CHARS} characters .`
        : "",
    });
  } catch (error) {
    console.log("Quiz error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET: Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      notes: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET: Get single note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    res.json({
      success: true,
      note: note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST: Check ATS Score for Resume
router.post("/ats-score", upload.single("file"), async (req, res) => {
  try {
    const input = await extractInputText(req);
    const text = input.text;

    const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility. Score it from 0-100 and provide detailed breakdown. Return JSON format:
{
  "totalScore": 85,
  "scoreBreakdown": {
    "formatting": 90,
    "keywords": 80,
    "sections": 85,
    "contactInfo": 100,
    "experience": 80,
    "education": 75,
    "skills": 85
  },
  "strengths": ["List of 3-4 strengths"],
  "weaknesses": ["List of 3-4 areas to improve"],
  "recommendations": ["List of 3-5 actionable recommendations"],
  "atsCompatibility": "High/Medium/Low",
  "summary": "Brief summary of ATS compatibility"
}

Resume: ${text}`;

    const atsResponse = await callAI(prompt);

    let atsData = {};
    try {
      const extractedJSON = extractJSON(atsResponse);
      atsData = JSON.parse(extractedJSON);
    } catch (e) {
      console.log("Failed to parse ATS JSON:", e.message);
      throw new AppError(
        "Failed to generate ATS score. Please try again.",
        502
      );
    }

     let note = await Note.findOne({ originalText: text });
    if (note) {
      note.atsScore = atsData;
      await note.save();
    } else {
      note = new Note({
        originalText: text,
        atsScore: atsData,
      });
      await note.save();
    }

    res.json({
      success: true,
      atsScore: atsData,
      noteId: note._id,
      warning: input.truncated
        ? `Your note was trimmed to the first ${GEMINI_MAX_INPUT_CHARS} characters to stay within API limits.`
        : "",
    });
  } catch (error) {
    console.log("ATS Score error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
});

 router.get("/models/list", async (req, res) => {
  try {
    if (GEMINI_MODELS.length === 0) {
      await fetchAvailableModels();
    }
    
    res.json({
      success: true,
      models: GEMINI_MODELS,
      count: GEMINI_MODELS.length,
      currentModel: GEMINI_MODELS[currentModelIndex] || "none",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST:  
router.post("/models/refresh", async (req, res) => {
  try {
    await fetchAvailableModels();
    
    res.json({
      success: true,
      models: GEMINI_MODELS,
      count: GEMINI_MODELS.length,
      message: "Models refreshed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

 fetchAvailableModels().catch((error) => {
  console.log("Warning: Could not fetch models on startup:", error.message);
});
