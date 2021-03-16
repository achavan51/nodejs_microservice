import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// needed properties for new skill
interface UserSkillAttrs {
  userId: string;
  skillId: string;
}

// needed properties for new Document
interface UserSkillDoc extends mongoose.Document, UserSkillAttrs {
  version: number;
  completed: boolean;
}

// model interface
interface UserSkillModel extends mongoose.Model<UserSkillDoc> {
  build(attrs: UserSkillAttrs): UserSkillDoc
}

const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  skillId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
}, {
  toJSON : {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

schema.set('versionKey', 'version');
schema.plugin(updateIfCurrentPlugin);

schema.statics.build = (attrs: UserSkillAttrs) => {
  return new UserSkill(attrs)
}

const UserSkill = mongoose.model<UserSkillDoc, UserSkillModel>('UserSkill', schema);

export { UserSkill, UserSkillDoc }