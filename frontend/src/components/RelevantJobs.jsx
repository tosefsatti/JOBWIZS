// src/components/RelevantJobs.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import { Button } from "../components/ui/button";

export default function RelevantJobs() {
    const profileSkills = useSelector((store) => store.auth.user.profile.skills) || [];
    const [matchingJobs, setMatchingJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            console.log("[Frontend] Fetching recommendations with skills:", profileSkills);
            const { data } = await axios.post(
                "http://localhost:8000/api/ml/recommend",
                {},
                { withCredentials: true }
            );
            console.log("[Frontend] Received category:", data.category);
            console.log("[Frontend] Received jobs count:", data.jobs.length);
            setMatchingJobs(data.jobs);
        } catch (e) {
            console.error("Recommendation error:", e);
            const msg = e.response?.data?.error || "Failed to fetch recommendations.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-6">
            <Button onClick={fetchRecommendations} disabled={loading || profileSkills.length === 0}>
                {loading ? "Matching…" : "Show Relevant Jobs"}
            </Button>

            {profileSkills.length === 0 && (
                <p className="mt-4 text-sm text-red-500">
                    Please add skills in your profile to see relevant jobs.
                </p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-4">
                {loading ? (
                    <span>Loading matches…</span>
                ) : matchingJobs.length === 0 ? (
                    <span className="text-gray-700">No matching jobs found</span>
                ) : (
                    matchingJobs.map((job) => (
                        <LatestJobCards key={job._id} job={job} />
                    ))
                )}
            </div>
        </div>
    );
}