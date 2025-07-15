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
exports.deleteAdmin = exports.getAdmin = void 0;
const issue_model_1 = require("../models/issue.model");
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issue = yield issue_model_1.IssueModel.find({}).populate("userId", "fullName");
        res.json({
            issue,
        });
    }
    catch (err) {
        console.error("Error fetching issues:", err);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
exports.getAdmin = getAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield issue_model_1.IssueModel.deleteOne({
        _id: issueId,
        userID: authReq.userId,
    });
    try {
        if (result.deletedCount === 0) {
            res.status(404).json({
                message: "Issue not found",
            });
        }
    }
    catch (error) {
        console.error("Error deleting issue:", error);
        res.json({
            message: " Deleted Sucessfully!",
        });
    }
});
exports.deleteAdmin = deleteAdmin;
