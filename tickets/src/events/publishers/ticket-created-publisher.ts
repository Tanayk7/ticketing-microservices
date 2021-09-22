import { Publisher, Events, TicketCreatedEvent } from "@tktickets1111/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    event: Events.TICKET_CREATED = Events.TICKET_CREATED;
}