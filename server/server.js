const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { join } = require("node:path");

require("dotenv").config(); // Load environment variables
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const numberRoutes = require("./routes/availableNumber");
const authRoutes = require("./routes/auth");
const {job} = require("./controllers/cron");

// Import the cron job


const app = express();

const environment = process.env.SERVER_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // Allow cookies to be sent
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Serve static files from the React app
if (environment === 'production') {
  app.use(express.static(join(__dirname, '/client/dist')));
}

// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/numbers", numberRoutes);
app.use("/api/auth", authRoutes);

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '/client/dist/index.html'));
});

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Start the cron job to keep the server alive
job.start();
console.log('Cron job has been started.');
