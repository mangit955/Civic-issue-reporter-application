"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignin = exports.userSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../../models/user.model");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//User Signup =>
const signupSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, { message: "Full name is required" }).trim(),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    })
        .trim(),
    email: zod_1.z.string().email({ message: "Invalid email format" }).trim(),
    phonenumber: zod_1.z
        .string()
        .length(10, { message: "Phone number must be exactly 10 digits" }),
});
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = signupSchema.parse(req.body);
        const { fullName, password, email, phonenumber } = parsedData;
        if (!fullName || !password || !email || !phonenumber) {
            res.status(400).json({ message: "Please fill all the fields" });
        }
        const existingUser = yield user_model_1.UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: " User already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield user_model_1.UserModel.create({
            fullName,
            password,
            email,
            phonenumber,
        });
        console.log("User created!");
        res.status(200).json({ message: "User Signed up!" });
    }
    catch (err) {
        if (err.name === "ZodError") {
            res.status(400).json({
                message: "Validation failed",
                errors: err.errors,
            });
        }
        console.error("Error creating user:", err);
        res
            .status(411)
            .json({ message: "User already exists or another error occurred" });
    }
});
exports.userSignup = userSignup;
//User Signin =>
const userSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield user_model_1.UserModel.findOne({
        email,
        password,
    });
    try {
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({
                id: existingUser._id,
            }, process.env.JWT_PASSWORD);
            res.json({
                token,
                user: {
                    id: existingUser._id,
                    fullName: existingUser.fullName,
                    email: existingUser.email,
                    role: "citizen",
                },
            });
            console.log("User signed in!");
        }
    }
    catch (error) {
        console.error("Error during user signin:", error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.userSignin = userSignin;
