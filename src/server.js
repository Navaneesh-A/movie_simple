// MongoDB-only backend; this does not change or replace Firebase.
// The frontend must POST { title, date } to /api/movies to save a copy in MongoDB.

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5174"
}));
app.use(express.json());

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);

app.post("/api/movies", async (req, res) => {
    const title = typeof req.body.title === "string"
        ? req.body.title.trim()
        : "";
    const date = Number(req.body.date);

    if (!title || !Number.isFinite(date)) {
        return res.status(400).json({ error: "A title and numeric date are required." });
    }

    try {
        const movie = await Movie.create({ title, date });
        return res.status(201).json(movie);
    } catch (error) {
        console.error("Failed to save movie to MongoDB:", error);
        return res.status(500).json({ error: "Failed to save movie." });
    }
});

async function startServer() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set. Add it to your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    app.listen(port, () => {
        console.log(`MongoDB API listening on port ${port}`);
    });
}

startServer().catch((error) => {
    console.error("Could not start MongoDB API:", error);
    process.exitCode = 1;
});