// src/components/QuizPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

export default function QuizPage() {
    const [questions, setQuestions] = useState([]);   // default to empty array
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/quiz/generate", { withCredentials: true })
            .then(res => {
                const q = res.data.questions;
                if (!Array.isArray(q)) {
                    throw new Error("Invalid quiz data");
                }
                setQuestions(q);
            })
            .catch(err => {
                console.error("Quiz load error:", err);
                setError("Could not load quiz. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (qId, idx) => {
        setAnswers(a => ({ ...a, [qId]: idx }));
    };

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.answerIndex) correct++;
        });
        setScore(correct);
    };

    if (loading) return <p>Loading quiz…</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    // safeQuestions will always be an array
    const safeQuestions = Array.isArray(questions) ? questions : [];

    if (score !== null) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Your Score: {score} / {safeQuestions.length}
                </h2>
                <Button onClick={() => {
                    setScore(null);
                    setAnswers({});
                }}>
                    Retake Quiz
                </Button>
            </div>
        );
    }

    if (safeQuestions.length === 0) {
        return <p>No questions available.</p>;
    }

    return (
        <div className="p-6 space-y-6">
            {safeQuestions.map(q => (
                <div key={q.id} className="border p-4 rounded">
                    <p className="font-medium">{q.question}</p>
                    <div className="mt-2 space-y-1">
                        {Array.isArray(q.options) ? q.options.map((opt, i) => (
                            <label key={i} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    checked={answers[q.id] === i}
                                    onChange={() => handleSelect(q.id, i)}
                                />
                                <span>{opt}</span>
                            </label>
                        )) : <p className="text-red-500">Invalid options</p>}
                    </div>
                </div>
            ))}
            <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < safeQuestions.length}
            >
                Submit Quiz
            </Button>
        </div>
    );
}
