import { Publisher, Subjects, SkillUpdatedEvent } from '@*****/common';

export class SkillUpdatedPublisher extends Publisher<SkillUpdatedEvent> {
  readonly subject = Subjects.SkillUpdated;
}
