"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        console.log("Invalid token or missing authorization header");
        res.status(401).json({
            message: "Authorization header is missing or malformed",
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        console.log("Decoded JWT:", decoded);
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        console.log("Error verifying JWT:", e);
        res.status(403).json({
            message: "Invalid token or expired",
        });
    }
};
exports.userMiddleware = userMiddleware;
