import mongoose from 'mongoose';

afterEach(
  async (): Promise<void> => {
    mongoose.connection.readyState === 2 && (await mongoose.connection.db.dropDatabase());
  }
);
