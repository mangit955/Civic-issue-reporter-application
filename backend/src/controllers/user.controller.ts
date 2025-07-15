import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

export const deleteIssue = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    userId: authReq.userId,
  });

  try {
    if (result.deletedCount === 0) {
      res.status(404).json({
        message: " Content not found !",
      });
    }
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.json({
      message: "Deleted Successfully !",
    });
  }
};

// Function to get issues for a user

export const getIssuesByUser = async (req: Request, res: Response) => {
  //@ts-ignore
  const userId = req.userId;
  console.log("userId in getIssuesByUser:", userId);
  const issue = await IssueModel.find({
    userId: userId,
  }).populate("userId", "fullName");

  res.json({
    issue,
  });
};
