import { OrderCancelledEvent } from '@thammarat/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelListener } from '../order-cancel-listener';

const setup = async () => {
  const listener = new OrderCancelListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: 'Concert',
    price: 99,
    userId: 'abcd',
  });
  await ticket.save();
  const orderId = mongoose.Types.ObjectId().toHexString();
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, listener, ticket, orderId };
};

it('updates the ticket, published an event, and acks the message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();
  await listener.onMessage(data, msg);
  const t1 = await Ticket.findById(ticket.id);
  expect(msg.ack).toHaveBeenCalled();
  expect(t1!.orderId).not.toBeDefined();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
