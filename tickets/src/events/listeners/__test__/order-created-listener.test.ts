import { OrderCreatedEvent, OrderStatus } from '@thammarat/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: 'Concert',
    price: 99,
    userId: 'abcd',
  });
  await ticket.save();
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.AwaitingPayment,
    userId: 'abcd',
    expiresAt: new Date(new Date().getTime() + 60 * 15 * 1000).toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, listener, ticket };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const t1 = await Ticket.findById(ticket.id);
  expect(t1!.orderId).toEqual(data.id);
});

it('calls the ack message', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('published a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const updatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1],
  );
  expect(data.id).toEqual(updatedData.orderId);
});
