import { Publisher, Subjects, OrderCancelledEvent } from '@thammarat/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
