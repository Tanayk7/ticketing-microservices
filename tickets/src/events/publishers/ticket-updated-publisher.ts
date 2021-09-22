import { Publisher, Events, TicketUpdatedEvent } from "@tktickets1111/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    event: Events.TICKET_UPDATED = Events.TICKET_UPDATED;
}