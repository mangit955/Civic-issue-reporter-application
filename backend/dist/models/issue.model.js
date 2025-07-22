"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueModel = void 0;
const mongoose_1 = require("mongoose");
const IssueSchema = new mongoose_1.Schema({
    citizenId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Multimedia",
    },
}, { timestamps: true });
exports.IssueModel = (0, mongoose_1.model)("Issue", IssueSchema);
