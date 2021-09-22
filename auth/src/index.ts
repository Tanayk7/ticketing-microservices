import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3000;

(async () => {
    console.log("starting up...");

    // check if JWT_KEY evnironment variable exists 
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log("Connected to database successfully");
    }
    catch (err) {
        console.log(err)
    }

    app.listen(PORT, () => {
        console.log("Listening on: ", PORT);
    })
})();

