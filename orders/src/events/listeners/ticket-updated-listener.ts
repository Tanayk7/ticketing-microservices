import { Message } from 'node-nats-streaming';
import { Events, Listener, TicketUpdatedEvent } from '@tktickets1111/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName as queue_group_name } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    eventName: Events.TICKET_UPDATED = Events.TICKET_UPDATED;
    queueGroupName = queue_group_name;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}