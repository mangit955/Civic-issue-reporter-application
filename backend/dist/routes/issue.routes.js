"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlerware/upload.middleware");
const issues_controllers_1 = require("../controllers/issues.controllers");
const auth_middleware_1 = require("../middlerware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/citizen/issue/create", auth_middleware_1.authMiddleware, (req, res, next) => {
    console.log("Before upload middleware");
    upload_middleware_1.upload.array("files", 10)(req, res, (err) => {
        console.log("Upload middleware callback");
        if (err) {
            console.error("=== UPLOAD ERROR ===");
            console.error("Error type:", typeof err);
            console.error("Error:", err);
            console.error("Error message:", err === null || err === void 0 ? void 0 : err.message);
            return res
                .status(400)
                .json({ message: "Upload failed", error: err.message });
        }
        console.log("Upload successful, proceeding to controller");
        next();
    });
}, issues_controllers_1.createIssue);
router.get("/all-issues", auth_middleware_1.authMiddleware, issues_controllers_1.getIssues);
exports.default = router;
