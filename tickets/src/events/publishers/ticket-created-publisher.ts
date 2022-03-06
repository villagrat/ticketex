import { Publisher, Subjects, TicketCreatedEvent } from '@public-gittix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
