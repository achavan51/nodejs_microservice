import mongoose from "mongoose";
import { Password } from "../services/password";
import { AccountType } from '@*****/common'

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
  accountType: AccountType,
  emailVerified: boolean;
  registerToken: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document, UserAttrs {
  records: [boolean];
  // email: string;
  // password: string;
  // accountType: AccountType
  // emailVerified: boolean;
  // registerToken: string;
  registered: boolean;
  registerTokenCreatedAt: Date,
  basicTrainingCompleted: boolean
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: AccountType,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    registerToken: {
      type: String,
    },
    registerTokenCreatedAt: {
      type: Date,
      default: Date.now
    },
    registered: {
      type: Boolean,
      default: false,
    },
    firstName: String,
    lastName: String,
    birthday: String,
    mobilePhone: String,
    nickname: String,
    nationality: String,
    countryResidence: String,
    workedBefore: Boolean,
    openVideo: Boolean,
    tellUsExperience: String,
    selectedSkillType: [{ type: String, enum: ["Standart", "Enhanced"] }],
    experienceItems: [
      {
        jobTitle: String,
        startOfWork: Date,
        endOfWork: Date,
        _id: false
      }
    ],
    records: [Boolean],
    basicTrainingCompleted: Boolean
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User, UserDoc };
