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
exports.getIssuesBycitizen = exports.deleteIssue = exports.updateCitizenProfile = exports.getCitizenProfile = void 0;
const issue_model_1 = require("../models/issue.model");
const citizen_model_1 = require("../models/citizen.model");
const getCitizenProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const citizen = yield citizen_model_1.CitizenModel.findById(id).select("-password");
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
        const updatedCitizen = yield citizen_model_1.CitizenModel.findByIdAndUpdate(id, { fullName, email, phonenumber, address }, { new: true });
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
const deleteIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authReq = req;
    const issueId = req.body.issueId;
    const result = yield issue_model_1.IssueModel.deleteOne({
        _id: issueId,
        citizenId: authReq.citizenId,
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
const getIssuesBycitizen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const citizenId = req.citizenId;
    console.log("citizenId in getIssuesBycitizen:", citizenId);
    const issue = yield issue_model_1.IssueModel.find({
        citizenId: citizenId,
    }).populate("citizenId", "fullName");
    res.json({
        issue,
    });
});
exports.getIssuesBycitizen = getIssuesBycitizen;
