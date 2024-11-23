const express = require("express");
const {
    getAllUsers,
    assignNumberToUser,
    createUser,
    loginUser,
    getUserById,
    signout
} = require("../controllers/user");
const { requireSignin, authMiddleware } = require("../middlewares/auth"); // Import the middlewares

const router = express.Router();

// Define routes for user actions

// Route to get all users (Requires authentication)
router.get("/", requireSignin, authMiddleware, getAllUsers);

// Route to fetch a user by ID (Requires authentication)
router.get("/:id", requireSignin, authMiddleware, getUserById);

// Route to assign a number to a specific user (Requires authentication)
router.put("/:id/assign-number", requireSignin, authMiddleware, assignNumberToUser);

// Route to create a new user (No authentication required)
router.post("/create", createUser);

// Route to login (No authentication required)
router.post("/login", loginUser);

// Route to sign out (Requires authentication)
router.get("/signout", requireSignin, signout);

module.exports = router;
