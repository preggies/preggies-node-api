import app, { PORT } from './server';

/* eslint-disable no-console */
((): void => {
  // Start server
  const server = app.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
  });

  // Close server if there is any unhandled rejection (promises)
  process.on('unhandledRejection', (err: Error): void => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection ❌❌❌');

    server.close();
    process.exit(1);
  });
})();
