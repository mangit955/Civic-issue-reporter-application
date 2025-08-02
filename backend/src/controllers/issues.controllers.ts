import { Request, Response } from "express";
import { IssueModel } from "../models/issue.model";
import { MultimediaModel } from "../models/multimedia.model";

export const createIssue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];

    const { title = "Untitled", description, location, issueType } = req.body;
    // location stuff

    let parsedLocation = location;
    if (typeof location === "string") {
      try {
        parsedLocation = JSON.parse(location);
      } catch {
        res.status(400).json({ message: "Invalid location JSON format" });
        return;
      }
    }

    if (
      !title ||
      !description ||
      !parsedLocation ||
      !parsedLocation.latitude ||
      !parsedLocation.longitude ||
      !issueType
    ) {
      res.status(400).json({ message: "Please fill all the required fields " });
      return;
    }

    const existingIssue = await IssueModel.findOne({ title });
    if (existingIssue) {
      res
        .status(400)
        .json({ message: " Issue with this title already exists" });
      return;
    }

    const issue = await IssueModel.create({
      citizenId: (req as any).citizenId, // Adapt as per your auth
      issueType,
      title,
      description,
      location: parsedLocation,
      status: "Reported",
      multimediaId: (req as any).multimediaId,
    });

    const mediaDocs = await Promise.all(
      files.map((file) =>
        MultimediaModel.create({
          issueID: issue._id,
          fileType: file.mimetype.startsWith("video") ? "video" : "image",
          url: file.path,
          filename: file.originalname,
        })
      )
    );
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
      .populate("citizenId", "fullName")
      .lean();

    const issuesWithMedia = await Promise.all(
      issues.map(async (issue) => {
        const media = await MultimediaModel.find({ issueID: issue._id });
        return {
          _id: issue._id,
          title: issue.title,
          description: issue.description,
          type: issue.issueType,
          location: issue.location, //  send only address
          reportedBy: (issue.citizenId as any)?.fullName || "Anonymous",
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
