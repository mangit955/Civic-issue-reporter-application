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
exports.adminSignin = exports.adminSignup = void 0;
const admin_model_1 = require("../../models/admin.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const fullname = req.body.fullname;
    const phonenumber = req.body.phonenumber;
    const department = req.body.department;
    const position = req.body.position;
    try {
        yield admin_model_1.AdminModel.create({
            username,
            password,
            email,
            fullname,
            phonenumber,
            department,
            position,
        });
        console.log("Admin created!");
        res.status(200).json({
            message: "Admin Signed up!",
        });
    }
    catch (e) {
        res.status(411).json({
            message: "Admin already exists",
        });
    }
});
exports.adminSignup = adminSignup;
const adminSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield admin_model_1.AdminModel.findOne({
        username,
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
exports.adminSignin = adminSignin;
//  "username" : ""
//  "password ": ""
//  "email" : ""
//  "fullname" : ""
//  "phonenumber" : ""
//  "department" : ""
//  "position" : ""
