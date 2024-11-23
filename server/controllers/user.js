const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AvailableNumber = require("../models/availableNumber");
const {comparePasswords} = require("../helper/bcryptHelper");

// Create a new user with no assigned number initially
const createUser = async (req, res) => {
    try {
        let { name, phoneNumber } = req.body;

        // Trim spaces from name and phoneNumber
        name = name.trim();
        phoneNumber = phoneNumber.trim();

        // Validate phone number format
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            return res.status(400).json({ message: "Phone number must be 10 digits long" });
        }

        // Check if the phone number already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User with that phone number already exists. Don't add a user twice because it will interfere with number generation." });
        }

        // Create the user with no assigned number (null or 0)
        const newUser = new User({
            name,
            phoneNumber,
            username: phoneNumber, // Set the phone number as the username
            password: phoneNumber, // Set the phone number as the password (encrypted later)
            assignedNumber: null, // No number assigned initially
        });

        // Save the new user to the database
        await newUser.save();

        // After saving, update the available numbers model
        const userCount = await User.countDocuments(); // Get total users after addition

        // Generate a new sequential number for the AvailableNumber model
        const newNumber = new AvailableNumber({
            number: userCount, // Assign based on user count
            chosen: false, // Default to not chosen
        });

        // Save the available number
        await newNumber.save();
        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user" });
    }
};



// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Fetch users excluding the password field
        const users = await User.find().select('-password'); // '-password' excludes the password field
        console.log(users)
        res.json(users);
    } catch (error) {
        res.status(500).json({message: "Error fetching users"});
    }
};


// Assign a number to a user
const assignNumberToUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {number} = req.body;

        // Check if the number exists in the AvailableNumber model
        const availableNumber = await AvailableNumber.findOne({number});

        if (!availableNumber) {
            return res.status(400).json({message: "Number not available"});
        }

        // Assign the number to the user
        const user = await User.findByIdAndUpdate(userId, {assignedNumber: number}, {new: true});

        // Remove the number from the AvailableNumber model (no longer available)
        await AvailableNumber.findByIdAndDelete(availableNumber._id);

        res.json(user); // Return the updated user with the assigned number
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error assigning number to user"});
    }
};

// User login and JWT generation
// Example loginUser controller
const loginUser = async (req, res) => {
    try {
        let { username, password } = req.body;

        // Trim spaces from username and password
        username = username.trim();
        password = password.trim();

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare entered password with hashed password
        const isPasswordValid = await comparePasswords(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token with 1-week expiry
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }); // Expires in 7 days

        // Set the token as a cookie
         res.cookie('token', token, {expiresIn: '7d'})

        // Return user data and token
        const userData = {
            userId: user._id,
            name: user.name,
            assignedNumber: user.assignedNumber,
            phoneNumber: user.phoneNumber,
            chosen: user.chosen,
        };

        res.status(200).json({ userData, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};


const getUserById = async (req, res) => {
    const userId = req.params.id;
    console.log('Fetching user with ID:', userId);

    try {
        const user = await User.findById(userId).select('-password'); // Exclude password

        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log('User found:', user);
        res.status(200).json(user); // Return the user details
    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ message: "Error fetching user" });
    }
};

const signout = async (req, res) => {

    try {
        // Clear the authentication token cookie
        res.clearCookie('token');

        // Respond with a success message
        res.status(200).json({ message: 'Signout success' });
    } catch (error) {
        console.error('Error during signout:', error);
        res.status(500).json({ message: 'Error during signout' });
    }
};
module.exports = {
    createUser,
    getAllUsers,
    assignNumberToUser,
    loginUser,
    signout,
    getUserById
};
