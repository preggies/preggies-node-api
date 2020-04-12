import app, { PORT } from './server';

/* eslint-disable no-console */
(async () => {
  // Start server
  const server = await app.listen(PORT);
  console.log(`Server running on port ${PORT}`); // eslint-disable-line no-console

  // Close server if there is any unhandled rejection (promises)
  process.on('unhandledRejection', (err: Error) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection ❌❌❌');

    server.close(() => {
      process.exit(1);
    });
  });
})();
