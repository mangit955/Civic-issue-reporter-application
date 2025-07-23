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
exports.deleteIssueByAdmin = exports.updateIssueStatus = exports.updateAdminProfile = exports.getAdminProfile = void 0;
const admin_model_1 = require("../models/admin.model");
const issue_model_1 = require("../models/issue.model");
const getAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const loggedInAdminId = req.adminId;
        if (id !== loggedInAdminId) {
            res.status(403).json({ message: "Unauthorised access" });
            return;
        }
        const admin = yield admin_model_1.AdminModel.findById(id).select("-password").lean();
        if (!admin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        res.json(admin);
    }
    catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAdminProfile = getAdminProfile;
const updateAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const loggedInAdminId = req.adminId;
        if (id !== loggedInAdminId) {
            res.status(403).json({ message: "Unauthorised access" });
            return;
        }
        const { fullName, email, phonenumber, department } = req.body;
        if (!fullName || !email || !phonenumber || !department) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const updatedAdmin = yield admin_model_1.AdminModel.findByIdAndUpdate(id, { fullName, email, phonenumber, department }, { new: true });
        if (!updatedAdmin) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        res.json({ message: "Profile updated successfully", user: updatedAdmin });
    }
    catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateAdminProfile = updateAdminProfile;
const updateIssueStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const loggedInAdminId = req.adminId;
        if (id !== loggedInAdminId) {
            res.status(403).json({ message: "Unauthorised access" });
            return;
        }
        const { issueId, status } = req.body;
        const validStatuses = ["Reported", "In Progress", "Resolved", "Rejected"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        const updatedIssue = yield issue_model_1.IssueModel.findByIdAndUpdate(issueId, { status }, { new: true });
        if (!updatedIssue) {
            res.status(404).json({ message: "Issue not found" });
            return;
        }
        res.json({ message: "Issue updated successfully", user: updatedIssue });
    }
    catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateIssueStatus = updateIssueStatus;
const deleteIssueByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield issue_model_1.IssueModel.deleteOne({
        _id: issueId,
        adminId: authReq.adminId,
    });
    try {
        const { id } = req.params;
        const loggedInAdminId = req.adminId;
        if (id !== loggedInAdminId) {
            res.status(403).json({ message: "Unauthorised access" });
            return;
        }
        if (result.deletedCount === 0) {
            res.status(404).json({
                message: "Issue not found",
            });
        }
    }
    catch (error) {
        console.error("Error deleting issue:", error);
    }
    res.json({
        message: " Deleted Sucessfully!",
    });
});
exports.deleteIssueByAdmin = deleteIssueByAdmin;
