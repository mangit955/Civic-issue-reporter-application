import { AdminModel } from "../models/admin.model";
import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

export const getAdminProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const admin = await AdminModel.findById(id).select("-password"); // Exclude password

    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateAdminProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, phonenumber, department } = req.body;

    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      id,
      { fullName, email, phonenumber, department },
      { new: true }
    );

    if (!updatedAdmin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.json({ message: "Profile updated successfully", user: updatedAdmin });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

export const updateIssueStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { issueId, status } = req.body;

    const updatedIssue = await IssueModel.findByIdAndUpdate(
      issueId,
      { status },
      { new: true }
    );

    if (!updatedIssue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }

    res.json({ message: "Issue updated successfully", user: updatedIssue });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
