const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');


// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Send response with user data and token
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error during user registration:", error); // Log error for debugging
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Both email and password are required!' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        // Compare the entered password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);

        // If passwords do not match
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        // If password matches, generate and send token along with user details
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
// Get User Details
exports.getUser = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
