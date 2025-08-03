"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
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
    // JWT_PASSWORD is expected to be set in the environment variables
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_PASSWORD);
        console.log("Decoded JWT:", decoded);
        //@ts-ignore
        if (decoded.role === "citizen") {
            req.citizenId = decoded.id;
        }
        else if (decoded.role === "admin") {
            req.adminId = decoded.id;
        }
        req.role = decoded.role;
        next();
    }
    catch (e) {
        console.error("Error verifying JWT:", e);
        res.status(403).json({
            message: "Invalid token or expired",
        });
    }
};
exports.authMiddleware = authMiddleware;
