import { Publisher, Subjects, ExpertAccountCreatedEvent } from '@*****/common'

export class ExpertAccountCreatedPublisher extends Publisher<ExpertAccountCreatedEvent> {
  readonly subject = Subjects.ExpertAccountCreated;
}
