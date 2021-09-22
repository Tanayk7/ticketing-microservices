import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tktickets1111/common';
import { deleteOrdersRouter } from './routes/delete';
import { indexOrdersRouter } from './routes';
import { newOrdersRouter } from './routes/new';
import { showOrdersRouter } from './routes/show';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentUser);
app.use(indexOrdersRouter);
app.use(showOrdersRouter);
app.use(newOrdersRouter);
app.use(deleteOrdersRouter);
app.all("*", async (req, res) => {
    throw new NotFoundError();
    // normal way - next(new NotFoundError());
});
app.use(errorHandler);

export { app };