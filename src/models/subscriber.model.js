const { Schema, model } = require("mongoose");

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Subscriber = model("Subscriber", subscriberSchema);

module.exports = Subscriber;
