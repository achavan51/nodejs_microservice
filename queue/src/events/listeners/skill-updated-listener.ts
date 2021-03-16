import { Message } from 'node-nats-streaming';
import { Subjects, Listener, SkillUpdatedEvent } from '@*****/common';
import { Skill } from '../../models/skill';
import { queueGroupName } from './queue-group-name';

export class SkillUpdatedEListener extends Listener<SkillUpdatedEvent> {
  readonly subject = Subjects.SkillUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: SkillUpdatedEvent['data'], msg: Message) {
    const skill = await Skill.findByEvent(data);

    if (!skill) {
      throw new Error("Skill not found");
    }

    const { title, rate } = data;
    skill.set({
      title,
      rate
    })
    await skill.save();

    msg.ack()
  }
}