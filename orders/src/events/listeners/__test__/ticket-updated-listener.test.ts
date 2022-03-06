import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@public-gittix/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake 'data' event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'VIP concert',
    price: 500,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake 'Message' object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
  // Run setup
  const { listener, data, msg, ticket } = await setup();

  // Call the onMessage f(data,Message)
  await listener.onMessage(data, msg);

  // Check that the ticket was Updated
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  // Run setup
  const { listener, data, msg } = await setup();

  // Call the onMessage f(data,Message)
  await listener.onMessage(data, msg);

  // Check that ack f() is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event version is out of order', async () => {
  // Run setup
  const { listener, data, msg, ticket } = await setup();

  // Mess with the version
  data.version = 10;

  try {
    // Call the onMessage f(data,Message)
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
