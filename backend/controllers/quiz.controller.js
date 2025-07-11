import axios from 'axios';
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// ===== Fallback Question Generator =====
function generateFallbackQuestions(skills) {
    const questionTemplates = [
        "{skill} ka istemal kahan hota hai?",
        "{skill} mein kaun si feature important hai?",
        "{skill} ka creator kaun hai?",
        "{skill} ka latest version konsa hai?",
        "{skill} ke alternatives kaun se hain?"
    ];

    return skills.slice(0, 10).map((skill, index) => ({
        id: index + 1,
        question: questionTemplates[index % questionTemplates.length].replace("{skill}", skill),
        options: generateOptions(skill, skills),
        answerIndex: 0,
        explanation: "Fallback question - try again later"
    }));
}

function generateOptions(correctSkill, allSkills) {
    const options = [correctSkill];
    while (options.length < 4) {
        const randomSkill = allSkills[Math.floor(Math.random() * allSkills.length)];
        if (!options.includes(randomSkill)) options.push(randomSkill);
    }
    return options.sort(() => Math.random() - 0.5);
}

// ===== Gemini 2.0 Flash API Config =====
const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const generateQuiz = async (req, res) => {
    try {
        // 1. Validate API Key
        if (!GEMINI_API_KEY) throw new Error("Google Gemini API key is missing!");

        // 2. Get User Skills
        const user = await User.findById(req.id).select("profile.skills");
        const skills = user?.profile?.skills || [];
        if (!skills.length) {
            return res.status(400).json({
                error: "Please add skills to your profile first",
                questions: []
            });
        }

        // 3. Prepare Prompt (explicitly ask for pure JSON)
        const prompt = `
            Generate 10 technical multiple-choice questions about: ${skills.join(", ")}.
            Return ONLY valid JSON without Markdown formatting:
            {
                "questions": [
                    {
                        "id": 1,
                        "question": "text",
                        "options": ["a", "b", "c", "d"],
                        "answerIndex": 0,
                        "explanation": "text"
                    }
                ]
            }
        `;

        // 4. Call Gemini API
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            },
            {
                headers: { "Content-Type": "application/json" },
                timeout: 10000 // 10-second timeout
            }
        );

        // 5. Parse Response (with Markdown cleaning)
        const content = response.data.candidates[0].content.parts[0].text;
        const cleanedContent = content.replace(/```(json)?/g, '').trim();

        try {
            const quizData = JSON.parse(cleanedContent);
            return res.json(quizData);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            throw new Error("Received invalid JSON from Gemini");
        }

    } catch (err) {
        console.error("[Quiz Error]:", err.message);
        // Fallback to generated questions
        const skills = (await User.findById(req.id).select("profile.skills"))?.profile?.skills || ["JavaScript", "React"];
        return res.json({
            questions: generateFallbackQuestions(skills),
            warning: "AI service unavailable - using fallback questions"
        });
    }
};