"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: {
        type: String,
        required: [
            true,
            "Password Must Have Atleast one UpperCase, LowerCase and Number each",
        ],
        min: [8, "Must be at least 8 Character"],
    },
    email: { type: String, unique: true, required: true, lowercase: true },
    fullname: { type: String, required: true },
    phonenumber: {
        type: String,
        required: [true, "User phone number required"],
    },
    department: { type: String, required: true },
    position: { type: String, required: true },
}, { timestamps: true });
exports.AdminModel = (0, mongoose_1.model)("Admin", AdminSchema);
