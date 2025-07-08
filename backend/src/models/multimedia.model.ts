import { model, Schema } from "mongoose";

const MultimediaSchema = new Schema(
  {
    issueID: {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    fileType: {
      type: String,
      enum: ["image", "video"],
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MultimediaModel = model("Multimedia", MultimediaSchema);
