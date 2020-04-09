import connect from './connect';

const config = {
  'mongo.host': 'mongodb://localhost:27017',
  get: function(name) {
    return this[name];
  },
  has: function(name) {
    this.hasOwnProperty(name);
  },
} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const mongoose = {
  connect: jest.fn().mockImplementation(
    uri =>
      new Promise((resolve, reject) => {
        /(?=(mongodb))\1[:/]{3}[a-z0-9:]*(?<=:27017)/.test(uri)
          ? resolve({ connected: true })
          : reject(new Error(`Not a valid MongoDB uri ${uri}`));
      })
  ),
};

describe('MongoDB Connection Handle', () => {
  it('connect successfully with mongo uri', async () => {
    expect(await connect(mongoose, config)).toEqual({ connected: true });
  });

  it('couldnt connect with wrong mongo uri', async () => {
    config['mongo.host'] = 'https://preggies.co';
    await expect(connect(mongoose, config)).rejects.toThrow();
  });
});
