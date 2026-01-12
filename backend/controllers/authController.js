const jwt = require('jsonwebtoken');
const User = require('../models/User');



// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1h'});
};

// Register User
module.exports.registerUser = async (req, res) => {
    const {fullName, email, password, profileImageUrl} = req.body;

    // Debug: log incoming body for troubleshooting
    console.log('Register payload:', { fullName, email, profileImageUrl });

    // Validation: Check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({message: 'All fields are required.'});
    }

    try{
        // Check if email already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'Email already exists.'});
        }

        // Normalize profile image value: convert empty string to null
        const normalizedProfileImageUrl = profileImageUrl && profileImageUrl.trim() !== "" ? profileImageUrl : null;

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl: normalizedProfileImageUrl
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({message: 'Error creating user.', error: error.message});
    }
};

// Login User
module.exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    // Validation: Check for missing fields
    if (!email || !password) {
        return res.status(400).json({message: 'All fields are required.'});
    }

    try {
        // Find user by email
        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message: 'Invalid email or password.'});
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({message: 'Error logging in user.', error: error.message});
    }
};


// Get User Info
module.exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(401).json({message: 'User not found.'});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Error getting user info.', error: error.message});
    }
};

