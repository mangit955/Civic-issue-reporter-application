import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const issue = await IssueModel.find({}).populate("userId", "fullName");
    res.json({
      issue,
    });
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    userID: authReq.userId,
  });

  try {
    if (result.deletedCount === 0) {
      res.status(404).json({
        message: "Issue not found",
      });
    }
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.json({
      message: " Deleted Sucessfully!",
    });
  }
};
