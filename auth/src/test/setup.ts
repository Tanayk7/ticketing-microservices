import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


declare global {
    namespace NodeJS {
        interface Global {
            signup(): Promise<string[]>
        }
    }
}


let mongo: any;
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


global.signup = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
}