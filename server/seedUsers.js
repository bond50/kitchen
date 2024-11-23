const mongoose = require("mongoose");
const User = require("./models/user");  // Import your User model
const AvailableNumber = require("./models/availableNumber"); // Import AvailableNumber model
const {hashPassword} = require("./helper/bcryptHelper"); // Import hashPassword function
require("dotenv").config();

// Special numbers from environment variables
const specialNumbers = [
    process.env.ARNEST_NO,  // Special number for ARNEST_NO
    process.env.GALAVU_NO,  // Special number for GALAVU_NO
    process.env.ANNE_NO,    // Special number for ANNE_NO
    process.env.ASENA_NO    // Special number for ASENA_NO (last number)
];

// Function to generate unique phone numbers starting with 07
const generateUniquePhoneNumbers = (num) => {
    const phoneNumbers = new Set(); // Use Set to ensure uniqueness
    while (phoneNumbers.size < num) {
        const randomNumber = "07" + Math.floor(Math.random() * 1000000000); // Generate a number starting with 07
        phoneNumbers.add(randomNumber);
    }
    return Array.from(phoneNumbers);
};

// Function to seed available numbers (only numbers from 1-18, excluding special numbers)
const seedAvailableNumbers = async () => {
    try {
        // Create numbers 1 through 18, excluding special numbers
        const allNumbers = Array.from({length: 18}, (_, i) => i + 1)
            .filter(number => !specialNumbers.includes(number));  // Exclude special numbers

        // Create and save the available numbers in the database
        for (const number of allNumbers) {
            const availableNumber = new AvailableNumber({number, chosen: false});
            await availableNumber.save();
        }

        console.log("Successfully seeded available numbers.");
    } catch (error) {
        console.error("Error during seeding available numbers:", error);
    }
};

// Function to seed users with unique phone numbers and random usernames
const seedUsers = async () => {
    try {
        // Users with special numbers set directly from environment variables
        const users = [
            {
                name: "Arnest Namayi",
                phoneNumber: process.env.ARNEST_NO.trim(),
                username: process.env.ARNEST_NO.trim(), // Trim spaces
                password: process.env.ARNEST_NO.trim()
            },
            {
                name: "Galavu Walter",
                phoneNumber: process.env.GALAVU_NO,
                username: process.env.GALAVU_NO.trim(), // Trim spaces
                password: process.env.GALAVU_NO.trim()
            },
            {
                name: "Anne Kimani",
                phoneNumber: process.env.ANNE_NO.trim(),
                username: process.env.ANNE_NO.trim(), // Trim spaces
                password: process.env.ANNE_NO.trim()
            },
            {
                name: "Asena Jacline",
                phoneNumber: process.env.ASENA_NO.trim(),
                username: process.env.ASENA_NO.trim(), // Trim spaces
                password: process.env.ASENA_NO.trim()
            }
        ];

        // Generate 14 unique phone numbers starting with 07
        const phoneNumbers = generateUniquePhoneNumbers(14);

        // Hardcoded names for the remaining 14 users
        const additionalUsers = [
            {name: "Peter Tosh"},
            {name: "Bob Marley"},
            {name: "Jimmy Cliff"},
            {name: "Reggae Star"},
            {name: "Michael Jackson"},
            {name: "Freddie Mercury"},
            {name: "Elton John"},
            {name: "David Bowie"},
            {name: "Adele"},
            {name: "Beyoncé"},
            {name: "Taylor Swift"},
            {name: "Kanye West"},
            {name: "Rihanna"},
            {name: "Lady Gaga"}
        ];

        // Map the names and phone numbers together
        additionalUsers.forEach((user, index) => {
            users.push({
                name: user.name,
                phoneNumber: phoneNumbers[index],
                username: phoneNumbers[index], // Trim spaces
                password:phoneNumbers[index] // Trim spaces
            });
        });

        // Ensure all phone numbers are unique and hash passwords for each user
        const existingNumbers = new Set();
        for (const user of users) {
            if (existingNumbers.has(user.phoneNumber)) {
                console.log(`Duplicate phone number found: ${user.phoneNumber}. Skipping user.`);
                continue; // Skip users with duplicate phone numbers
            }
            existingNumbers.add(user.phoneNumber);
            const pass =user.phoneNumber
            const trimmedPassword = pass.trim();

            console.log(`To be Hashed password for ${user.name}:`,trimmedPassword);
            console.log(`Untrimmed ${user.name}:`,pass);

            // Hash the password
            const hashedPassword = await hashPassword(trimmedPassword);
            const newUser = new User({
                ...user,         // Spread the user object to retain all fields
                password: hashedPassword // Replace plain password with hashed one
            });
            await newUser.save();  // Save the user
        }

        console.log("Successfully seeded users with unique phone numbers and passwords.");
    } catch (error) {
        console.error("Error during seeding users:", error);
    }
};

// Run the seeding process (remove deprecated options)
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB for seeding...");
        seedAvailableNumbers()
            .then(() => seedUsers())
            .catch(error => console.error("Error in seeding process:", error));
    })
    .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    });
