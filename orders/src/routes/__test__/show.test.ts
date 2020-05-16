import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

it('fetched the order', async () => {
  const ticket = Ticket.build({ title: 'Concert', price: 20 });
  await ticket.save();
  const user = global.signin();
  const {
    body: { id: orderId },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  const {
    body: { id: orderId2 },
  } = await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(200);

  expect(orderId).toEqual(orderId2);
});

it('returns an error if one user tries to fetch another users order', async () => {
  const ticket = Ticket.build({ title: 'Concert', price: 20 });
  await ticket.save();
  const user1 = global.signin();
  const user2 = global.signin();
  const {
    body: { id: orderId },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', user2)
    .send({ ticketId: ticket.id })
    .expect(401);
});
