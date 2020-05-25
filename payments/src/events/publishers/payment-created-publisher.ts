import { Publisher, Subjects, PaymentCreatedEvent } from '@thammarat/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
