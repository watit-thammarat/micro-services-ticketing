import { Message } from 'node-nats-streaming';

import { Listener, TicketCreatedEvent, Subjects } from '@thammarat/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TickCreated = Subjects.TickCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
    msg.ack();
  }
}
