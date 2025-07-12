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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_auth_controller_1 = require("../controllers/auth-controllers/admin.auth.controller");
const issue_model_1 = require("../models/issue.model");
const auth_middleware_1 = require("../middlerware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/signup/admin", admin_auth_controller_1.adminSignup);
router.post("/signin/admin", admin_auth_controller_1.adminSignin);
router.get("/issue/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue = yield issue_model_1.IssueModel.find({}).populate("userID", "username");
        res.json({
            issue,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
}));
router.delete("/issue/admin/delete", auth_middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield issue_model_1.IssueModel.deleteOne({
        _id: issueId,
        userID: authReq.userId,
    });
    if (result.deletedCount === 0) {
        res.status(404).json({
            message: "Issue not found",
        });
    }
    else {
        res.json({
            message: " Deleted Sucessfully!",
        });
    }
}));
exports.default = router;
