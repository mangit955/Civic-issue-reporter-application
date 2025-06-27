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
app.post("/api/v1/issue/user", (req, res) => { });
app.get("/api/v1/issue/user", (req, res) => { });
app.delete("/api/v1/issue/user", (req, res) => { });
//admin api's
app.post("/api/v1/signup/admin", (req, res) => { });
app.post("/api/v1/signin/admin", (req, res) => { });
app.get("/api/v1/issue/admin", (req, res) => { });
app.listen(3000);
