import {
  Subjects,
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
} from '@public-gittix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Any change made to an order will increase its version number
    // Ideally we would emit an Event to pertaining services
    // about order:updated
    // However, in the context of this app's usage case,
    // after an order is set to 'Complete' no other service will
    // attempt to listen or manipulate that order again
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
