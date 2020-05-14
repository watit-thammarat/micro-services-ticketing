import { Publisher, Subjects, TicketCreatedEvent } from '@thammarat/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TickCreated = Subjects.TickCreated;
}
