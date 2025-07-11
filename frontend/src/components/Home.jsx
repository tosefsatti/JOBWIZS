// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import RelevantJobs from "./RelevantJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Button } from './ui/button'

const Home = () => {
  // kick off your jobs fetch
  useGetAllJobs();

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // if logged in as recruiter, send to admin companies page
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 top-10">
        <HeroSection />

        <CategoryCarousel />

        {/* Show the “Show Relevant Jobs” button & list if resumeText exists */}
        {user?.profile?.skills?.length > 0 && (
          <section className="my-10">
            <h2 className="text-xl font-semibold mb-4">
              Jobs Matching Your Skills
            </h2>
            <RelevantJobs />
          </section>
        )}

        {user?.profile?.skills?.length > 0 && (
          <section className="my-8">
            <Button onClick={() => navigate("/quiz")}>
              Take Skills Quiz
            </Button>
          </section>
        )}
        <LatestJobs />

        <Footer />
      </main>
    </div>
  );
};

export default Home;
