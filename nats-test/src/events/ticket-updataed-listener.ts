import { Listener } from './base-listener';
import { Stan, Message } from 'node-nats-streaming';

import { Subjects } from './subject';
import { TicketUpdatedEvent } from './ticket-updated-event';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = 'payments-service';

  constructor(client: Stan) {
    super(client);
  }

  onMessage(data: TicketUpdatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);
    msg.ack();
  }
}
