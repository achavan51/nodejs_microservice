import mongoose from "mongoose";
// import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// needed properties for new skill
interface ExpertAttrs {
  expertId: string;
  basicTrainingCompleted: boolean;
}

// needed properties for new Document
interface ExpertDoc extends mongoose.Document, ExpertAttrs {}

// model interface
interface ExpertModel extends mongoose.Model<ExpertDoc> {
  build(attrs: ExpertAttrs): ExpertDoc;
}

const schema = new mongoose.Schema(
  {
    expertId: {
      type: String,
      required: true,
    },
    basicTrainingCompleted: {
      type: Boolean,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// schema.set('versionKey', 'version');
// skillSchema.plugin(updateIfCurrentPlugin);

schema.statics.build = (attrs: ExpertAttrs) => {
  return new Expert(attrs);
};

const Expert = mongoose.model<ExpertDoc, ExpertModel>("Expert", schema);

export { Expert, ExpertDoc };
