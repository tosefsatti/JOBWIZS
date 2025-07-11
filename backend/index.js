import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import messageRouter from "./routes/message.route.js"
import { app, server } from "./socket/socket.js";
import mlRoutes from "./routes/ml.routes.js";
import quizRoute from "./routes/quiz.routes.js"
import friendRoute from "./routes/friendRequest.route.js";
dotenv.config({});


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRouter);

app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);


app.use("/api/ml", mlRoutes);
app.use("/api/quiz", quizRoute);

app.use("/api/v1/friends", friendRoute)
console.log("Using OPENAI_API_KEY:", process.env.GOOGLE_API_KEY);


server.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
})