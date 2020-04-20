import app, { PORT, secure } from './server';

/* eslint-disable no-console */
(async (): Promise<void> => {
  const server = secure
    ? require('https').createServer(
        {
          ...(secure || {}),
        },
        app
      )
    : require('http').createServer(app);

  server.listen(PORT, (): void => {
    console.log(`Server running on port ${PORT}`);
  });

  // Close server if there is any unhandled rejection (promises)
  process.on(
    'unhandledRejection',
    async (err: Error): Promise<void> => {
      console.log(err.name, err.message);
      console.log('Unhandled Rejection ❌❌❌');

      const db = await app.db;
      await db.disconnect();
      server.close();
      process.exit(1);
    }
  );
})();
