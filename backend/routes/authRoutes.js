const express = require('express');
const Protect = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getUserInfo
} = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', Protect, getUserInfo);

// Upload image and send to Cloudinary
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const User = require('../models/User');

// Public upload endpoint (returns Cloudinary URL)
router.post('/upload-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'finance-tracker/profile_images',
            use_filename: true,
            unique_filename: false,
            resource_type: 'image',
        });

        // remove local file after upload
        fs.unlink(req.file.path, (err) => {
            if (err) console.warn('Failed to remove local file:', err.message);
        });

        res.status(200).json({ imageUrl: result.secure_url, public_id: result.public_id });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.message });
    }
});

// Protected endpoint: upload and attach profile image to authenticated user
router.post('/upload-profile', Protect, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'finance-tracker/profile_images',
            use_filename: true,
            unique_filename: false,
            resource_type: 'image',
        });

        fs.unlink(req.file.path, (err) => {
            if (err) console.warn('Failed to remove local file:', err.message);
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profileImageUrl: result.secure_url },
            { new: true, select: '-password' }
        );

        res.status(200).json({ user: updatedUser, imageUrl: result.secure_url, public_id: result.public_id });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile image', error: error.message });
    }
});

module.exports = router;