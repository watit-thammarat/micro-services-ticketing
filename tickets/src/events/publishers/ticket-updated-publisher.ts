import { Publisher, Subjects, TicketUpdatedEvent } from '@thammarat/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
