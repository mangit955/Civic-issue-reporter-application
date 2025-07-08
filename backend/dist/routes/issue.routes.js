"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_middleware_1 = require("../middlerware/upload.middleware");
const issues_controllers_1 = require("../controllers/issues.controllers");
const auth_middleware_1 = require("../middlerware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/create/issue/user", auth_middleware_1.userMiddleware, upload_middleware_1.upload.array("files", 10), issues_controllers_1.createIssue);
exports.default = router;
