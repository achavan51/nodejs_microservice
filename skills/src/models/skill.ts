import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Company } from "./company";

interface TrainingMetarial {
  name: string;
  file: string;
}
// needed properties for new skill
interface SkillAttrs {
  code: string;
  name: string;
  rate: number;
  companyId: string;
  skillType: string; // TODO skillType enum
}

// needed properties for new Document
interface SkillDoc extends mongoose.Document, SkillAttrs {
  version: number;
  trainingMetarials: Array<TrainingMetarial>;
}

// model interface
interface SkillModel extends mongoose.Model<SkillDoc> {
  build(attrs: SkillAttrs): SkillDoc;
}

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    skillType: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    trainingMetarials: [
      {
        name: String,
        file: String,
      },
    ],
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

skillSchema.virtual("company", {
  ref: "Company",
  localField: "companyId",
  foreignField: "companyId",
  justOne: true,
});

skillSchema.set("versionKey", "version");
skillSchema.plugin(updateIfCurrentPlugin);

skillSchema.statics.build = (attrs: SkillAttrs) => {
  return new Skill(attrs);
};

const Skill = mongoose.model<SkillDoc, SkillModel>("Skill", skillSchema);

export { Skill, SkillDoc };
