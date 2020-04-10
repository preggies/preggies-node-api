import app from './server';

/* eslint-disable no-console */
(async () => {
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
