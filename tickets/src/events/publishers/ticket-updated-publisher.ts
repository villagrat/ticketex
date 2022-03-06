import { Publisher, Subjects, TicketUpdatedEvent } from '@public-gittix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
