import { Publisher, OrderCreatedEvent, Events } from "@tktickets1111/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    event: Events.ORDER_CREATED = Events.ORDER_CREATED;

}