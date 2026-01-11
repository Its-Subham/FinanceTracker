// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// module.exports = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization;
//         if (!token) {
//             return res.status(401).json({message: 'Not authorized, no token.'});
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select('-password');

//         if (!req.user) {
//             return res.status(401).json({message: 'Invalid token.'});
//         }

//         next();
//     } catch (error) {
//         res.status(500).json({message: 'Error authenticating user.', error: error.message});
//     }
// };





const jwt = require("jsonwebtoken");
const User = require("../models/User");

const Protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found." });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Not authorized, token failed.",
            error: error.message
        });
    }
};

module.exports = Protect;
