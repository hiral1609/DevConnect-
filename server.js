require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import database connection function
const connectDB = require('./config/db');

// Import our routes (API endpoints)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Create the express app
const app = express();

// Connect to MongoDB Database
connectDB();

// Setup Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Allow sending JSON data in request body
app.use(express.urlencoded({ extended: true })); // Allow form data

// Serve static files (like CSS, JS, Images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the 'uploads' folder so images/videos can be viewed in the browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------------------------------------------
// API ROUTES (Backend Logic)
// ----------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// ----------------------------------------------------
// FRONTEND ROUTES (HTML Pages)
// ----------------------------------------------------
const viewPath = path.join(__dirname, 'views'); // Path to our HTML files

app.get('/', (req, res) => res.sendFile('login.html', { root: viewPath }));
app.get('/register', (req, res) => res.sendFile('register.html', { root: viewPath }));
app.get('/home', (req, res) => res.sendFile('home.html', { root: viewPath }));
app.get('/feed', (req, res) => res.sendFile('feed.html', { root: viewPath }));
app.get('/profile', (req, res) => res.sendFile('profile.html', { root: viewPath }));
app.get('/search', (req, res) => res.sendFile('search.html', { root: viewPath }));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is successfully running on port ${PORT}`);
});
