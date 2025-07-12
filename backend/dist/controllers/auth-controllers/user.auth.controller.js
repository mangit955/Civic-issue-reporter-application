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
//User Signup =>
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fullname = req.body.fullname;
    const password = req.body.password;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    try {
        yield user_model_1.UserModel.create({
            fullname,
            password,
            email,
            phonenumber,
        });
        console.log("User created!");
        res.status(200).json({
            message: "User Signed up!",
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User already exists",
        });
    }
});
exports.userSignup = userSignup;
//User Signin =>
const userSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = yield user_model_1.UserModel.findOne({
        email,
        password,
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, process.env.JWT_PASSWORD);
        res.json({
            token,
        });
    }
    else {
        res.status(411).json({
            message: "Incorrect Credentials!",
        });
    }
});
exports.userSignin = userSignin;
