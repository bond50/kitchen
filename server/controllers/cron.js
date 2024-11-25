const cron = require('cron');
const https = require('https');

// Define the backend URL that needs to be kept alive
const backendUrl = 'https://kitchen-0frb.onrender.com';

// Create a new cron job that runs every 14 minutes (*/14 * * * *)
const job = new cron.CronJob('*/13 * * * *', function () {
    console.log('Pinging server to keep it alive...');

    // Perform an HTTPS GET request to hit the backend API
    https.get(backendUrl, (res) => {
        if (res.statusCode === 200) {
            console.log('Server is active.');
        } else {
            console.error(`Failed to ping server with status code: ${res.statusCode}`);
        }
    })
    .on('error', (err) => {
        console.error('Error during ping:', err.message);
    });
});

// Export the cron job for use in other parts of the application
module.exports = {
    job,
};
