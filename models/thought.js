const { Schema, model } = require("mongoose");
const reactionSchema = require("./reaction");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlwngth: 280,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    username: {
      type: string,
      required: true,
    },

    // Array of nested documents created with the reactionSchema

    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactioncount").get(function () {
  return this.reactions.length;
});

const Thoughts = model("Thoughts", thoughtSchema);

module.exports = Thoughts;
