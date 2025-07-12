"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    password: {
        type: String,
        required: [
            true,
            "Password Must Have Atleast one UpperCase, LowerCase and Number each",
        ],
        min: [8, "Must be at least 8 Character"],
    },
    email: { type: String, required: true, lowercase: true },
    phonenumber: {
        type: String,
        required: [true, "User phone number required"],
    },
    department: { type: String, required: true },
    position: { type: String, required: true },
    adminAccessCode: { type: Number, required: true, unique: true },
}, { timestamps: true });
exports.AdminModel = (0, mongoose_1.model)("Admin", AdminSchema);
