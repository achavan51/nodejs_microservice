import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    skillId: {
      type: String,
      required: true,
    },
    questions: [
      {
        text: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
        options: [
          {
            text: { type: String, required: true },
            imageUrl: { type: String, required: true },
          },
        ],
        // optionsType: {
        //   type: String,
        //   required: true,
        //   enum: ["one", "multiple"],
        // },
        optionsRestriction: { min: Number, max: Number },

        answer: [{ type: Number }],
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

const Quiz = mongoose.model("Quizes", quizSchema);
export { Quiz };
