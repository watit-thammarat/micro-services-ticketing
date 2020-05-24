import { TicketCreatedEvent } from '@thammarat/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'test',
    userId: mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
