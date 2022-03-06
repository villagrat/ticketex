import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'cool concert',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.getCookieString();
  // make a request to build an order w/ the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch as user
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'cool concert',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // make a request to build an order w/ the ticket
  const user = global.getCookieString();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.getCookieString())
    .send()
    .expect(401);
});
