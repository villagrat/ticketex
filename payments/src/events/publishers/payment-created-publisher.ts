import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@public-gittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
