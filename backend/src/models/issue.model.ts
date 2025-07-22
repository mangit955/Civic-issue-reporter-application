import { model, Schema } from "mongoose";

const IssueSchema = new Schema(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
    },
    issueType: {
      type: String,
      enum: [
        "Road Infrastructure",
        "Waste Management",
        "Environmental Issues",
        "Utilities & Infrastructure",
        "Public Safety",
        "Other",
      ],
      default: "Road Infrastructure",
      required: true,
    },
    title: {
      type: String,
      unique: true,
      required: true,
      maxlength: 100,
      minlength: 5,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Reported", "In Progress", "Resolved", "Rejected"],
      default: "Reported",
    },
    location: {
      type: String,
      ref: "Location",
    },
    media: {
      type: Schema.Types.ObjectId,
      ref: "Multimedia",
    },
  },
  { timestamps: true }
);

export const IssueModel = model("Issue", IssueSchema);
