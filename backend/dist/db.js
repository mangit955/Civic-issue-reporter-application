"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationModel = exports.IssueModel = exports.AdminModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DATABASE_URL = process.env.DATABASE_URL || "";
console.log("Attempting to connect to DB with URL:", DATABASE_URL);
mongoose_1.default
    .connect(DATABASE_URL)
    .then(() => console.log("Connected to DB!"))
    .catch((err) => console.log("DB connection error:", err));
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: String,
    email: String,
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
const AdminSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, require },
    password: String,
    email: String,
    fullname: String,
    phonenumber: String,
    department: String,
    position: String,
});
exports.AdminModel = (0, mongoose_1.model)("Admin", AdminSchema);
const IssueSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
    title: String,
    description: String,
    location: String,
    status: Boolean,
    type: String,
    phonenumber: String,
    fullname: String,
    address: String,
    media: [
        {
            url: String,
            type: String,
            filename: String,
        },
    ],
});
exports.IssueModel = (0, mongoose_1.model)("Issue", IssueSchema);
const locationSchema = new mongoose_1.Schema({
    address: String,
});
exports.LocationModel = (0, mongoose_1.model)("Location", locationSchema);
