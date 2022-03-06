import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as Cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'cool concert',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // make a request to create an order
  const user = global.getCookieString();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'cool concert',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // make a request to create an order
  const user = global.getCookieString();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
