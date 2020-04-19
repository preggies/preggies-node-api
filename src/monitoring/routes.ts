import { Router } from 'express';

export const MOUNT_POINT = '/monitoring';

export default ({ router }): Router =>
  router.get('/healthz', (_, res) => res.send('{"status":"OK"}'));
