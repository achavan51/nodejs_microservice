import mongoose, { version } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface SkillsAttrs {
  skillId: string;
  name: string;
  code: string;
  rate: number;
}

export interface SkillDoc extends mongoose.Document, SkillsAttrs {
  version: number;
}

interface SkillModel extends mongoose.Model<SkillDoc> {
  build(attrs: SkillsAttrs): SkillDoc;
  // findbyId and rpevious version
  findByEvent(event: { skillId: string, version: number }): Promise<SkillDoc | null>;
}

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  skillId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

skillSchema.set('versionKey', 'version');
skillSchema.plugin(updateIfCurrentPlugin);

skillSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Skill.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

skillSchema.statics.build = (attrs: SkillsAttrs) => {
  return new Skill({
    skillId: attrs.skillId,
    name: attrs.name,
    code: attrs.code,
    rate: attrs.rate,
  });
};

const Skill = mongoose.model<SkillDoc, SkillModel>('Skill', skillSchema);

export { Skill }