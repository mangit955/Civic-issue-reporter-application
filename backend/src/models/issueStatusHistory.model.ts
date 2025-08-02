import { model, Schema } from "mongoose";

const IssueStatusHistorySchema = new Schema(
  {
    issueID: {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    status: {
      type: String,
      enum: ["Reported", "In Progress", "Resolved", "Rejected", "Pending"],
      required: true,
    },
    handledBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export const IssueStatusHistoryModel = model(
  "IssueStatusHistory",
  IssueStatusHistorySchema
);
