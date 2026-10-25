require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Movie = require("./models/movies");
const Booking = require("./models/booking");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("ShowBook Backend is Running!");
});

// Get all movies
app.get("/movies", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// Add a movie
app.post("/movies", async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create a booking
app.post("/bookings", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        const savedBooking = await booking.save();

        res.status(201).json({
            message: "Booking saved successfully!",
            booking: savedBooking
        });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({
            message: "Booking save nahi hui",
            error: error.message
        });
    }
});

// Get all bookings
app.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Bookings load error:", error);
        res.status(500).json({
            message: "Bookings load nahi hui",
            error: error.message
        });
    }
});
app.get("/test-route", (req, res) => {
    res.send("Correct ShowBook server is running!");
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, );
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`ShowBook server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
    }
}

startServer();
