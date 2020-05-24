import { Message } from 'node-nats-streaming';

import { Listener, TicketUpdatedEvent, Subjects } from '@thammarat/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const { title, price, id } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
