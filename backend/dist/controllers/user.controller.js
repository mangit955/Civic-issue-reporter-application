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
exports.getIssuesByUser = exports.deleteIssue = exports.updateCitizenProfile = exports.getCitizenProfile = void 0;
const issue_model_1 = require("../models/issue.model");
const user_model_1 = require("../models/user.model");
const getCitizenProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const citizen = yield user_model_1.UserModel.findById(id).select("-password");
        if (!citizen) {
            res.status(404).json({ message: "Citizen not found" });
            return;
        }
        res.json(citizen);
    }
    catch (error) {
        console.error("Error fetching citizen profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getCitizenProfile = getCitizenProfile;
const updateCitizenProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fullName, email, phonenumber, address } = req.body;
        const updatedCitizen = yield user_model_1.UserModel.findByIdAndUpdate(id, { fullName, email, phonenumber, address }, { new: true });
        if (!updatedCitizen) {
            res.status(404).json({ message: "Citizen not found" });
            return;
        }
        res.json({ message: "Profile updated successfully", user: updatedCitizen });
    }
    catch (error) {
        console.error("Error updating citizen profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateCitizenProfile = updateCitizenProfile;
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield issue_model_1.IssueModel.deleteOne({
        _id: issueId,
        userId: authReq.userId,
    });
    try {
        if (result.deletedCount === 0) {
            res.status(404).json({
                message: " Content not found !",
            });
        }
    }
    catch (error) {
        console.error("Error deleting issue:", error);
        res.json({
            message: "Deleted Successfully !",
        });
    }
});
exports.deleteIssue = deleteIssue;
// Function to get issues for a user
const getIssuesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    console.log("userId in getIssuesByUser:", userId);
    const issue = yield issue_model_1.IssueModel.find({
        userId: userId,
    }).populate("userId", "fullName");
    res.json({
        issue,
    });
});
exports.getIssuesByUser = getIssuesByUser;
