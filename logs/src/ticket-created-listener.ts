import { Listener, TicketCreatedEvent, Events } from "@tktickets1111/common";
import { Message } from 'node-nats-streaming';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    eventName: Events.TICKET_CREATED = Events.TICKET_CREATED;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log("Event data!", data);
        msg.ack();
    }
}

export { TicketCreatedListener };