import express, { Request, Response } from 'express';;
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@tktickets1111/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validation_rules = [
    body('title').not().isEmpty().withMessage("Title is required"),
    body('price').isFloat({ gt: 0 }).withMessage("Price must be provided and must be greater than 0")
];

router.put(
    '/api/tickets/:id',
    requireAuth,
    validation_rules,
    validateRequest,
    async (req: Request, res: Response) => {
        // find the ticket to be updated 
        const ticket = await Ticket.findById(req.params.id);

        // if the specifed ticket is not found
        if (!ticket) {
            throw new NotFoundError();
        }
        // if the userId of the ticket fetched is not the users id  
        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        // prevent a user from editing a ticket that has been reserved
        if (ticket.orderId) {
            throw new BadRequestError("Cannot edit a reserved ticket");
        }

        // update  the ticket values
        ticket.set({
            title: req.body.title,
            price: req.body.price
        });

        // saves the updates to the ticket and updates the version of the ticket
        await ticket.save();

        // publishes a ticket updated event
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version
        });

        res.send(ticket);
    }
);

export { router as udpateTicketRouter };