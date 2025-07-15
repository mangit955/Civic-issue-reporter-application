"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    password: {
        type: String,
        required: [true],
        min: [8],
    },
    email: { type: String, required: true, lowercase: true },
    phonenumber: {
        type: String,
        required: [true],
    },
    department: { type: String, required: true },
    adminAccessCode: { type: Number, required: true, unique: true },
}, { timestamps: true });
exports.AdminModel = (0, mongoose_1.model)("Admin", AdminSchema);
