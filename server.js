require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // for uploaded images

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// View Routes (HTML pages)
const viewPath = path.join(__dirname, 'views');
app.get('/', (req, res) => res.sendFile('login.html', { root: viewPath }));
app.get('/register', (req, res) => res.sendFile('register.html', { root: viewPath }));
app.get('/home', (req, res) => res.sendFile('home.html', { root: viewPath }));
app.get('/feed', (req, res) => res.sendFile('feed.html', { root: viewPath }));
app.get('/profile', (req, res) => res.sendFile('profile.html', { root: viewPath }));
app.get('/search', (req, res) => res.sendFile('search.html', { root: viewPath }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
