import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

let mongo: any;

declare global {
    namespace NodeJS {
        interface Global {
            signup(id?: string): string[];
        }
    }
}

process.env.STRIPE_KEY = 'sk_test_51JbQfBSEjDMP8BjgkbgDF1vxsnb3umbzVhzbzn5RsqKvGvnEseU23TL59GBynGqWuPw543kvrwqodnftECsStOsS009skRgeu2';

// Will run before all tests are executed
// sets an env variable and connects to database
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// will run before each of the test 
// will reset all data in the collections of the DB
beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
})

// Will run after all the tests are done executing
// stops the mongo server and closes all mongoose connections
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

// In order to prevent any inter service requests and dependencies 
// A session must be faked in the test environment 
// @ts-ignore
global.signup = (id?: string) => {
    // build a JWT payload  { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with the encoded data  
    return [`express:sess=${base64}`];
}