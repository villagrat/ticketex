import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@public-gittix/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake 'data' event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 5,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake 'Message' object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  // Run setup
  const { listener, data, msg } = await setup();

  // Call the onMessage f(data,Message)
  await listener.onMessage(data, msg);

  // Check that the ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  // Run setup
  const { listener, data, msg } = await setup();

  // Call the onMessage f(data,Message)
  await listener.onMessage(data, msg);

  // Check that ack f() is called
  expect(msg.ack).toHaveBeenCalled();
});
