import mongoose from 'mongoose';

import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';
import { ExpirationCompleteEvent } from '@thammarat/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    userId: 'abc',
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(new Date().getTime() + 1000 * 60 * 15),
  });
  await order.save();
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, order, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, ticket, order, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const o = await Order.findById(order.id);
  expect(o!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, ticket, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, ticket, order, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
