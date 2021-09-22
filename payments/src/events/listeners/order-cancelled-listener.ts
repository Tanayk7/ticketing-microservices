import { OrderCancelledEvent, Events, Listener, OrderStatus } from "@tktickets1111/common";
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    eventName: Events.ORDER_CANCELLED = Events.ORDER_CANCELLED;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }
}