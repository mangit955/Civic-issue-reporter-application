import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

interface AuthRequest extends Request {
  userId?: string;
}

export const getCitizenProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const citizen = await UserModel.findById(id).select("-password");

    if (!citizen) {
      res.status(404).json({ message: "Citizen not found" });
      return;
    }

    res.json(citizen);
  } catch (error) {
    console.error("Error fetching citizen profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCitizenProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, phonenumber, address } = req.body;

    const updatedCitizen = await UserModel.findByIdAndUpdate(
      id,
      { fullName, email, phonenumber, address },
      { new: true }
    );

    if (!updatedCitizen) {
      res.status(404).json({ message: "Citizen not found" });
      return;
    }

    res.json({ message: "Profile updated successfully", user: updatedCitizen });
  } catch (error) {
    console.error("Error updating citizen profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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
