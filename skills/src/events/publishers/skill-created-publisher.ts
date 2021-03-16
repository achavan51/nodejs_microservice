import { Publisher, Subjects, SkillCreatedEvent } from '@*****/common'

export class SkillCreatedPublisher extends Publisher<SkillCreatedEvent> {
  readonly subject = Subjects.SkillCreated;
}
