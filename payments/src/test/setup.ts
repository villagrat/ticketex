import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var getCookieString: (id?: string) => string[];
}

//test-suite wide mock
jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51KYocXHb5xFFpmNYJgjKfOLfkb8Zqeo4qKW2pHDigd9daEqW1QbhvEWWOOUcsNunORpvcgE22a8fp8RTUgVyNett007mq57I11';

let mongo: any;
jest.setTimeout(90000);
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// If we provide the optional argument id, use it to authenticate us
// Else create a convincing looking one w/ mongoose
global.getCookieString = (id?: string) => {
  // Build a JWT payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string that's the cookie w/ the encoded data
  return [`session=${base64}`];
};
