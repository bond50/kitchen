// controllers/auth.js
const {requireSignin} = require('../middlewares/auth'); // Import the middleware
const User = require('../models/user'); // Import the User model

// Verify route - middleware will validate the JWT
exports.verifyToken = async (req, res) => {
    return res.status(200).json({success: true, message: 'Token is valid.'});

};
