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
      type,
      phonenumber,
      fullname,
      address,
    } = req.body;

    const issue = await IssueModel.create({
      userID: (req as any).userId,
      issueType: type,
      title,
      description,
      phonenumber,
      fullname,
      address,
      location,
      status,
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

// Function to get issues for a user

export const getIssuesByUser = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.userId;
  const issue = await IssueModel.find({
    userId: userId,
  }).populate("userId", "username");

  res.json({
    issue,
  });
};
