import { Publisher, Events, OrderCancelledEvent } from "@tktickets1111/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    event: Events.ORDER_CANCELLED = Events.ORDER_CANCELLED;
}