import mongoose, { Schema } from "mongoose";
// import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// needed properties for new skill
interface CompanyAttrs {
  companyId: string;
  name: string;
}

// needed properties for new Document
interface CompanyDoc extends mongoose.Document, CompanyAttrs {
  // version: number;
  // trainingMetarials: Array<TrainingMetarial>;
}

// model interface
interface CompanyModel extends mongoose.Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc;
}

const schema : Schema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
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

schema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs);
};

const Company = mongoose.model<CompanyDoc, CompanyModel>("Company", schema);

export { Company, CompanyDoc };
