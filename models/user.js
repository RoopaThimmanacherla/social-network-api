const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: string,
      unique: true,
      trimmed: true,
      required: true,
    },
    email: {
      type: string,
      unique: true,
      required: true,
      match: [/^([a-z0-9]+@[a-z]+\.[a-z]{2,3})$/],
    },

    //Array of _id values referencing the Thought model

    thoughts: [
      {
        type: Schema.Types.objectId,
        ref: "Thought",
      },
    ],
    //Array of _id values referencing the User model (self-reference)

    friends: [
      {
        type: Schema.Types.objectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const User = model("User", userSchema);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

module.exports = User;
