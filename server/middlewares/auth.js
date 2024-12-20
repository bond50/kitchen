const {expressjwt: expressJwt} = require("express-jwt"); // Correct import for express-jwt

const User = require('../models/user'); // Make sure to import your User model

// Middleware to verify JWT from the cookie
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",

});

exports.authMiddleware = async (req, res, next) => {
    const authUserId = req.auth.userId; // This comes from the decoded JWT in the `requireSignin` middleware

    try {
        const user = await User.findById(authUserId); // Using async/await here
        if (!user) {
            return res.status(400).json({
                error: 'User not found',
                notFound: true,
                success: false,
                message: 'User not found. Please sign in again.',

            });
        }


        req.profile = user; // Attach the user profile to `req.profile`


        next(); // Continue to the next middleware or route handler
    } catch (err) {
        return res.status(500).json({
            message: 'An error occurred while verifying the user. Please try again later.',
            error: 'Error fetching user profile'
        });
    }
};


exports.adminMiddleware = async (req, res, next) => {
    try {
        const user = req.profile; // `req.profile` is set in `authMiddleware`

        if (user.role !== 'admin') {
            return res.status(403).json({
                error: 'Access denied. Admins only.',
            });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({
            error: 'Error verifying admin privileges.',
        });
    }
};

