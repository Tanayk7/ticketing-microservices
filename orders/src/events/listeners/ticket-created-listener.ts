import { Message } from 'node-nats-streaming';
import { Events, Listener, TicketCreatedEvent } from '@tktickets1111/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName as queue_group_name } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    eventName: Events.TICKET_CREATED = Events.TICKET_CREATED;
    queueGroupName = queue_group_name;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log("Event received: ticket:created / orders-service");
        const { id, title, price } = data;
        const ticket = Ticket.build({ id, title, price });

        await ticket.save();

        msg.ack();
    }
}