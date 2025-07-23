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
exports.deleteIssue = exports.getIssuesByCitizen = exports.updateCitizenProfile = exports.getCitizenProfile = void 0;
const issue_model_1 = require("../models/issue.model");
const citizen_model_1 = require("../models/citizen.model");
const getCitizenProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInCitizenId = req.citizenId;
        const citizen = yield citizen_model_1.CitizenModel.findById(loggedInCitizenId)
            .select("-password")
            .lean();
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
        const loggedInCitizenId = req.citizenId;
        if (id !== loggedInCitizenId) {
            res.status(403).json({ message: "Unauthorised Citizen access" });
            return;
        }
        const { fullName, email, phonenumber } = req.body;
        if (!fullName || !email || !phonenumber) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const updatedCitizen = yield citizen_model_1.CitizenModel.findByIdAndUpdate(id, { fullName, email, phonenumber }, { new: true });
        if (!updatedCitizen) {
            res.status(404).json({ message: "Citizen not found" });
            return;
        }
        res.json({
            message: "Profile updated successfully",
            citizen: updatedCitizen,
        });
    }
    catch (error) {
        console.error("Error updating citizen profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateCitizenProfile = updateCitizenProfile;
const getIssuesByCitizen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    try {
        const citizenId = authReq.citizenId;
        if (!citizenId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const issues = yield issue_model_1.IssueModel.find({ citizenId })
            .populate("citizenId", "fullName")
            .sort({ createdAt: -1 })
            .lean();
        res.json({ issues });
    }
    catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getIssuesByCitizen = getIssuesByCitizen;
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield issue_model_1.IssueModel.deleteOne({
        _id: issueId,
        citizenId: authReq.citizenId,
    });
    try {
        const { id } = req.params;
        const loggedInCitizenId = req.citizenId;
        if (id !== loggedInCitizenId) {
            res.status(403).json({ message: "Unauthorised Citizen access" });
            return;
        }
        if (result.deletedCount === 0) {
            res.status(404).json({
                message: " Content not found !",
            });
            return;
        }
        res.json({
            message: "Deleted Successfully !",
        });
    }
    catch (error) {
        console.error("Error deleting issue:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.deleteIssue = deleteIssue;
