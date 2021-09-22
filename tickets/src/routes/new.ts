import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tktickets1111/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validation_rules = [
    body('title').not().isEmpty().withMessage("Title is required"),
    body('price').isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
]

router.post(
    "/api/tickets",
    requireAuth,
    validation_rules,
    validateRequest,
    async (req: Request, res: Response) => {
        // get the ticket title and price from the request body 
        const { title, price } = req.body;

        // build a ticket with the default params (title, price, userId)
        const ticket = Ticket.build({
            title, price, userId: req.currentUser!.id
        });

        // sets a version on the ticket
        await ticket.save();

        // publishes a ticket created event
        new TicketCreatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        })

        res.status(201).send(ticket);
    }
);


export { router as createTicketRouter }