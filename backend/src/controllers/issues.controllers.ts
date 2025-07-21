import { Request, Response } from "express";
import { IssueModel } from "../models/issue.model";
import { MultimediaModel } from "../models/multimedia.model";

export const createIssue = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    const {
      title = "Untitled",
      description,
      location,
      status,
      issueType,
    } = req.body;

    const issue = await IssueModel.create({
      userId: (req as any).userId,
      issueType,
      title,
      description,
      location,
      status,
      multimediaId: (req as any).multimediaId,
    });

    const mediaDocs = await Promise.all(
      files.map((file) =>
        MultimediaModel.create({
          issueID: issue._id,
          fileType: file.mimetype.startsWith("video") ? "video" : "image",
          url: (file as any).path,
          filename: file.originalname,
        })
      )
    );

    console.log("Request body:", req.body);
    console.log("Response body:", {
      message: "Issue created",
      media: mediaDocs,
    });

    res.status(200).json({ message: "Issue created", issue, media: mediaDocs });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIssues = async (req: Request, res: Response) => {
  try {
    const issues = await IssueModel.find({})
      .populate("userId", "fullName")
      .lean();

    type PopulatedIssue = (typeof issues)[number] & {
      userId?: { fullName?: string };
    };

    const issuesWithMedia = await Promise.all(
      issues.map(async (issue) => {
        const media = await MultimediaModel.find({ issueID: issue._id });
        const populatedIssue = issue as PopulatedIssue;
        return {
          _id: issue._id,
          title: issue.title,
          description: issue.description,
          type: issue.issueType,
          city: issue.location,
          reportedBy: populatedIssue.userId?.fullName || "Anonymous",
          reportedAt: issue.createdAt,
          image: media.length > 0 ? media[0].url : null,
          status: issue.status,
        };
      })
    );

    res.json({ issues: issuesWithMedia });
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
