import { Message } from 'node-nats-streaming';
import { Events, Listener, PaymentCreatedEvent, OrderStatus } from "@tktickets1111/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    eventName: Events.PAYMENT_CREATED = Events.PAYMENT_CREATED;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    }
}