import mongoose from 'mongoose';

afterEach(
  async (): Promise<void> => {
    mongoose.connection.readyState && (await mongoose.connection.db.dropDatabase());
  }
);
