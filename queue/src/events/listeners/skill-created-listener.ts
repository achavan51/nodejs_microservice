import { Message } from 'node-nats-streaming';
import { Subjects, Listener, SkillCreatedEvent } from '@*****/common'
import { Skill } from '../../models/skill';
import { queueGroupName } from './queue-group-name';

export class SkillCreatedListener extends Listener<SkillCreatedEvent> {
  readonly subject = Subjects.SkillCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: SkillCreatedEvent['data'], msg: Message) {
    const { id, name, code, rate } = data;

    const skill = Skill.build({
      skillId: id,
      name,
      code,
      rate
    });
    await skill.save();

    msg.ack();
  }
}
