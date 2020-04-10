import dbConnect, { close, schema } from '.';
import loadConfig from '../../../config';

jest.mock('./connect', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(
    (mongoose, config) =>
      new Promise((resolve, reject) => {
        mongoose && config
          ? resolve({ connected: true })
          : reject(new Error(`Config ${config} and Mongoose ${mongoose} error.`));
      })
  ),
}));

jest.mock('./queries', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(client => (client ? true : false)),
}));

describe('mongoose', () => {
  const mongo = {
    disconnect: jest.fn().mockResolvedValue(true),
  } as any;

  const config = loadConfig('', {});

  describe('.connect', () => {
    it('connects to mongodb', async () => {
      const mongoose = await dbConnect(config);

      expect(mongoose).toEqual({ connected: true });
    });

    it('Successfully close mongo connection', async () => {
      expect(await close(mongo)).toBeTruthy();
    });

    it('Successfully create a schema', async () => {
      expect(await schema({})).toBeTruthy();
    });
  });
});
