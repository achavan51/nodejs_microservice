import mongoose from 'mongoose'
import { QueueStatus } from '@*****/common'
import { SkillDoc } from './skill';


interface QueueAttrs {
  userId: string;
  status: QueueStatus;
  expiresAt: Date;
  skill: SkillDoc
}

interface QueueDoc extends mongoose.Document {
  userId: string;
  status: QueueStatus;
  expiresAt: Date;
  skill: SkillDoc
}

interface QueueModel extends mongoose.Model<QueueDoc> {
  build(attrs: QueueAttrs): QueueDoc;
}

const queueSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(QueueStatus),
    default: QueueStatus.Created
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }
},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

queueSchema.statics.build = (attrs: QueueAttrs) => {
  return new Queue(attrs);
}

const Queue = mongoose.model<QueueDoc, QueueModel>('Queue', queueSchema);

export { Queue }