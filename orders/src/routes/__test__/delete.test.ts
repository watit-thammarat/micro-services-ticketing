import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@thammarat/common';

it('marks an order as cancelled', async () => {
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
    body: { id: orderId2, status },
  } = await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', user)
    .send()
    .expect(200);
  expect(orderId).toEqual(orderId2);
  expect(status).toEqual(OrderStatus.Cancelled);
});

it.todo('emits an order cancelled event');
