import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

export const deleteUser = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    userId: authReq.userId,
  });

  if (result.deletedCount === 0) {
    res.status(404).json({
      message: " Content not found !",
    });
  } else {
    res.json({
      message: "Deleted Successfully !",
    });
  }
};
