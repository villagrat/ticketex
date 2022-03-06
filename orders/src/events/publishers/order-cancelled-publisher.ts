import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@public-gittix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
