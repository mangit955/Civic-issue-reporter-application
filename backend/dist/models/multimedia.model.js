"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultimediaModel = void 0;
const mongoose_1 = require("mongoose");
const MultimediaSchema = new mongoose_1.Schema({
    issueID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Issue",
        required: true,
    },
    fileType: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.MultimediaModel = (0, mongoose_1.model)("Multimedia", MultimediaSchema);
