const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Close server if there is any uncaught exceptions
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception ❌❌❌');
  process.exit(1);
});

// Environment file
dotenv.config({ path: './config.env' });

const app = require('./app');

// Start server
const port = process.env.port || 2020;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Close server if there is any unhandled rejection (promises)
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection ❌❌❌');
  server.close(() => {
    process.exit(1);
  });
});
