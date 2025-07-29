"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueStatusHistoryModel = void 0;
const mongoose_1 = require("mongoose");
const IssueStatusHistorySchema = new mongoose_1.Schema({
    issueID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Issue",
        required: true,
    },
    status: {
        type: String,
        enum: ["Reported", "In Progress", "Resolved", "Rejected", "Pending"],
        required: true,
    },
    handledBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    changedAt: {
        type: Date,
        default: Date.now,
    },
    changedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
}, { timestamps: true });
exports.IssueStatusHistoryModel = (0, mongoose_1.model)("IssueStatusHistory", IssueStatusHistorySchema);
