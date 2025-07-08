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
const user_auth_controller_1 = require("../controllers/auth-controllers/user.auth.controller");
const issue_model_1 = require("../models/issue.model");
const auth_middleware_1 = require("../middlerware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/signup/user", user_auth_controller_1.userSignup);
router.post("/signin/user", user_auth_controller_1.userSignin);
router.get("/issue/user", auth_middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const issue = yield issue_model_1.IssueModel.find({
        userId: userId,
    }).populate("userId", "username");
    res.json({
        issue,
    });
}));
router.delete("/issue/user", auth_middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield issue_model_1.IssueModel.deleteOne({
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
exports.default = router;
