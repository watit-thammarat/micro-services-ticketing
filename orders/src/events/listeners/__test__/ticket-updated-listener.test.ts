import { TicketUpdatedEvent } from '@thammarat/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 1,
    title: 'title',
  });
  await ticket.save();
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    price: 2,
    title: 'title 2',
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket: t1 } = await setup();
  await listener.onMessage(data, msg);
  const t2 = await Ticket.findById(t1.id);
  expect(t2).toBeDefined();
  expect(t2!.version).toEqual(data.version);
  expect(t2!.title).toEqual(data.title);
  expect(t2!.price).toEqual(data.price);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg, ticket: t1 } = await setup();
  data.version = 10;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
