import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@thammarat/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
