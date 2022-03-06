import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent } from '@public-gittix/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 333,
    userId: 'asdasd',
  });
  ticket.set({ orderId });
  await ticket.save();

  // create the fake 'data' event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create the fake 'msg' object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, orderId, data, msg };
};

it('updates the ticket, publishes an event and acks the message', async () => {
  // Run setup
  const { listener, ticket, orderId, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // initially tickets have an undefined orderId property
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
