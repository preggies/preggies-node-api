import { Router } from 'express';

const monitoring = Router();

export default monitoring.get('/healthz', async (_, res) => {
  res
    .json({
      status: 'OK',
    })
    .status(200);
});
