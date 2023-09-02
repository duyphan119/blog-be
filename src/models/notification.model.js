const { Schema, model, Types } = require("mongoose");

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    refId: {
      type: Types.ObjectId,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Notification = model("Notification", notificationSchema);

module.exports = Notification;
