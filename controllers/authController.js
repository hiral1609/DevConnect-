const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to generate a login token for the user
const generateToken = (id) => {
    // Creates a secure token valid for 30 days
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user
const registerUser = async (req, res) => {
    try {
        // 1. Get the details from the user's form
        const { username, email, password } = req.body;
        
        // 2. Check if a user with this email or username already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // 3. Create the new user in the database
        const user = await User.create({ username, email, password });

        // 4. If creation was successful, send back the user data and token
        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login an existing user
const loginUser = async (req, res) => {
    try {
        // 1. Get email and password from the login form
        const { email, password } = req.body;
        
        // 2. Find the user in the database by their email
        const user = await User.findOne({ email });
        
        // 3. Check if user exists AND if the password matches
        if (user && (await user.matchPassword(password))) {
            // 4. Send back user data and a new login token
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Wrong email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
