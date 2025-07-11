// server/controllers/ml.controller.js
import axios from "axios";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

const PYTHON_SERVICE = process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";

async function callMLService(skillsText) {
    console.log("[Backend] Sending skills to ML service:", skillsText);
    const resp = await axios.post(
        `${PYTHON_SERVICE}/predict`,
        { text: skillsText },
        { timeout: 5000 }
    );
    console.log("[Backend] ML service predicted category:", resp.data.category);
    return resp.data.category;
}

export const recommendJobs = async (req, res) => {
    try {
        // 1) Load user's skills from DB
        const user = await User.findById(req.id).select("profile.skills");
        const rawSkills = user?.profile?.skills;
        if (!Array.isArray(rawSkills) || rawSkills.length === 0) {
            return res.status(400).json({ error: "Please add skills to your profile first." });
        }

        // 2) Join skills into a single string
        const skillsText = rawSkills.join(" ");

        // 3) Predict category via Python ML service
        const predictedCategory = await callMLService(skillsText);

        // 4) Build case-insensitive regex
        const catRegex = new RegExp(predictedCategory, "i");

        // 5) Query jobs matching category in skills, description, or requirements
        console.log("[Backend] Querying jobs with regex:", catRegex);
        const jobs = await Job.find({
            $or: [
                { skills: catRegex },
                { description: catRegex },
                { requirements: catRegex }
            ]
        })
            .populate("company")
            .sort({ createdAt: -1 });

        // 6) Return matched jobs and category
        console.log("[Backend] Returning jobs count:", jobs.length);
        return res.json({ category: predictedCategory, jobs });
    } catch (err) {
        console.error("Recommend error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};