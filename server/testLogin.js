require("dotenv").config(); // Load environment variables
const connectDB = require("./config/db"); // MongoDB connection
const User = require("./models/User");
const {comparePasswords} = require("./helper/bcryptHelper"); // User model

const testLogin = async () => {
  try {
    await connectDB(); // Connect to the database

    console.log("Starting login tests...");

    // Fetch all users
    const users = await User.find();

    if (users.length === 0) {
      console.log("No users found in the database.");
      return;
    }

    for (const user of users) {
      const { username, password } = user;

      try {
        // Compare passwords (assuming passwords are stored hashed in the DB)
        const isPasswordValid = await comparePasswords(password, user.password);

        if (isPasswordValid) {
          console.log(`✅ ${username} can log in successfully.`);
        } else {
          console.log(`❌ ${username} cannot log in due to an invalid password.`);
        }
      } catch (error) {
        console.error(`Error testing login for ${username}:`, error.message);
      }
    }

    console.log("Login tests completed.");
  } catch (error) {
    console.error("Error during login tests:", error.message);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

// Execute the script
testLogin();
