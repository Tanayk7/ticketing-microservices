import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from '@tktickets1111/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const validation_rules = [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage("Ticket id must be provided"),
];
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
    "/api/orders",
    requireAuth,
    validation_rules,
    validateRequest,
    async (req: Request, res: Response) => {
        // get the ticket-id of the ticket to order 
        const { ticketId } = req.body;

        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);

        // if a ticket is not found
        if (!ticket) {
            throw new NotFoundError();
        }

        // check if this ticket is already reserved
        const isReserved = await ticket.isReserved();

        // if the ticket is reserved
        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved");
        }

        // If ticket is on reserved calculate an expiration date for the order 
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();

        // Publish an event saying that an order was created 
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            },
            version: order.version
        });

        res.status(201).send(order);
    }
)

export { router as newOrdersRouter }