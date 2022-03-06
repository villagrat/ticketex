import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@public-gittix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
