import { Publisher, OrderCreatedEvent, Subjects } from '@thammarat/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
