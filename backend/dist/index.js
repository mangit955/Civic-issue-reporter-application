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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config"); // Consider loading JWT_PASSWORD from environment variables for production.
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// user api's =>
app.post("/api/v1/signup/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //add zod validation, password hashing
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    try {
        yield db_1.UserModel.create({
            username,
            password,
            email,
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
}));
app.post("/api/v1/signin/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = yield db_1.UserModel.findOne({
        username,
        password,
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id,
        }, config_1.JWT_PASSWORD);
        res.json({
            token,
        });
    }
    else {
        res.status(411).json({
            message: "Incorrect Credentials!",
        });
    }
}));
app.post("/api/v1/create/issue/user", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const title = req.body.title || "Untitled";
    const description = req.body.description;
    const location = req.body.location;
    const status = req.body.status;
    const phonenumber = req.body.phonenumber;
    const fullname = req.body.fullname;
    const address = req.body.address;
    yield db_1.IssueModel.create({
        userId: req.userId,
        title,
        description,
        location,
        status,
        type,
        phonenumber,
        fullname,
        address,
    });
    res.json({
        message: "Content added!",
    });
}));
app.get("/api/v1/issue/user", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const issue = yield db_1.IssueModel.find({
        userId: userId,
    }).populate("userId", "username");
    res.json({
        issue,
    });
}));
app.delete("/api/v1/issue/user", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield db_1.IssueModel.deleteOne({
        _id: issueId,
        userId: authReq.userId,
    });
    if (result.deletedCount === 0) {
        res.status(404).json({
            message: " Content not found !",
        });
    }
    else {
        res.json({
            message: "Deleted Successfully !",
        });
    }
}));
//admin api's
app.post("/api/v1/signup/admin", (req, res) => { });
app.post("/api/v1/signin/admin", (req, res) => { });
app.get("/api/v1/issue/admin", (req, res) => { });
app.listen(3000);
//     "title": "testing",
//     "description":" harzardious",
//     "location": "Atlanta",
//     "status": "false",
//     "type":"damaged road",
//     "phonenumber": "1232343452",
//     "fullname": "Jhon doe",
//     "address": "near aditi's house"
