const dotenv = require('dotenv');
const mongoose = require('mongoose'); // eslint-disable-line no-unused-vars

(async () => {
  // Close server if there is any uncaught exceptions
process.on('uncaughtException', err => {
  console.log(err.name, err.message, err.stack);
  console.log('Uncaught Exception ❌❌❌');
  process.exit(1);
});

// Environment file
dotenv.config({ path: './config.env' });

const app = require('./app');

// Start server
const port = process.env.port || 2020;
const server = await app.listen(port);
console.log(`Server running on port ${port}`); // eslint-disable-line no-console


// Close server if there is any unhandled rejection (promises)
process.on('unhandledRejection', (err: Error) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection ❌❌❌');

  server.close(() => {
    process.exit(1);
  });
});

})();
