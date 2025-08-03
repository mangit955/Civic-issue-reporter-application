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
exports.getIssues = exports.createIssue = void 0;
const issue_model_1 = require("../models/issue.model");
const multimedia_model_1 = require("../models/multimedia.model");
const createIssue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files || [];
        const { title = "Untitled", description, location, issueType } = req.body;
        // location stuff
        let parsedLocation = location;
        if (typeof location === "string") {
            try {
                parsedLocation = JSON.parse(location);
            }
            catch (_a) {
                res.status(400).json({ message: "Invalid location JSON format" });
                return;
            }
        }
        if (!title ||
            !description ||
            !parsedLocation ||
            !parsedLocation.latitude ||
            !parsedLocation.longitude ||
            !issueType) {
            res.status(400).json({ message: "Please fill all the required fields " });
            return;
        }
        const existingIssue = yield issue_model_1.IssueModel.findOne({ title });
        if (existingIssue) {
            res
                .status(400)
                .json({ message: " Issue with this title already exists" });
            return;
        }
        const issue = yield issue_model_1.IssueModel.create({
            citizenId: req.citizenId, // Adapt as per your auth
            issueType,
            title,
            description,
            location: parsedLocation,
            status: "Reported",
            multimediaId: req.multimediaId,
        });
        const mediaDocs = yield Promise.all(files.map((file) => multimedia_model_1.MultimediaModel.create({
            issueID: issue._id,
            fileType: file.mimetype.startsWith("video") ? "video" : "image",
            url: file.path,
            filename: file.originalname,
        })));
        console.log("Response body:", {
            message: "Issue created",
            media: mediaDocs,
        });
        res.status(200).json({ message: "Issue created", issue, media: mediaDocs });
    }
    catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createIssue = createIssue;
const getIssues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issues = yield issue_model_1.IssueModel.find({})
            .populate("citizenId", "fullName")
            .lean();
        const issuesWithMedia = yield Promise.all(issues.map((issue) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const media = yield multimedia_model_1.MultimediaModel.find({ issueID: issue._id });
            return {
                _id: issue._id,
                title: issue.title,
                description: issue.description,
                type: issue.issueType,
                location: issue.location, //  send only address
                reportedBy: ((_a = issue.citizenId) === null || _a === void 0 ? void 0 : _a.fullName) || "Anonymous",
                reportedAt: issue.createdAt,
                image: media.length > 0 ? media[0].url : null,
                status: issue.status,
            };
        })));
        res.json({ issues: issuesWithMedia });
    }
    catch (err) {
        console.error("Error fetching issues:", err);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
exports.getIssues = getIssues;
