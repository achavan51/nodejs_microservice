import mongoose from "mongoose";

interface EmailAttrs {
  from: string;
  to: string;
  subject: string;
  bodyText: string;
  bodyHTML: string;
}

interface EmailDoc extends mongoose.Document, EmailAttrs {}

interface EmailModel extends mongoose.Model<EmailDoc> {
  build(attrs: EmailAttrs): EmailDoc;
}

const emailSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    reason: String,
    subject: {
      type: String,
      required: true,
    },
    bodyText: {
      type: String,
      required: true,
    },
    bodyHTML: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

emailSchema.statics.build = (attrs: EmailAttrs) => {
  return new Email(attrs);
};

const Email = mongoose.model<EmailDoc, EmailModel>("Email", emailSchema);

export { Email };

/* 
Email
-- reason type ekledim
-- accountType ekle

API 
---
POST /api/emails 
JWT -> {email, accountType}
body -> reason: singup

reason -> signup -> 
createdAt -> (sent at)

ayni gun max kac defa gonderecek? max gunde 3 defa mail atabilsin
*/
