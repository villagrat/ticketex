import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // prevents property of a class from being changed
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  // business logic goes here
  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data);

    msg.ack();
  }
}
