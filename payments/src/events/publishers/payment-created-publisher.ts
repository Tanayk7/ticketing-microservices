import { Events, Publisher, PaymentCreatedEvent } from '@tktickets1111/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    event: Events.PAYMENT_CREATED = Events.PAYMENT_CREATED;
}