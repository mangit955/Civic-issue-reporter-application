import { AdminModel } from "../models/admin.model";
import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  adminId?: string;
}

export const getAdminProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const loggedInAdminId = req.adminId;

    if (id !== loggedInAdminId) {
      res.status(403).json({ message: "Unauthorised access" });
      return;
    }

    const admin = await AdminModel.findById(id).select("-password").lean();

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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const loggedInAdminId = req.adminId;

    if (id !== loggedInAdminId) {
      res.status(403).json({ message: "Unauthorised access" });
      return;
    }

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

export const updateIssueStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const loggedInAdminId = req.adminId;

    if (id !== loggedInAdminId) {
      res.status(403).json({ message: "Unauthorised access" });
      return;
    }
    const { issueId, status } = req.body;

    const validStatuses = ["Reported", "In Progress", "Resolved", "Rejected"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

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

export const deleteIssueByAdmin = async (req: AuthRequest, res: Response) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    adminId: authReq.adminId,
  });

  try {
    const { id } = req.params;
    const loggedInAdminId = req.adminId;

    if (id !== loggedInAdminId) {
      res.status(403).json({ message: "Unauthorised access" });
      return;
    }
    if (result.deletedCount === 0) {
      res.status(404).json({
        message: "Issue not found",
      });
    }
  } catch (error) {
    console.error("Error deleting issue:", error);
  }
  res.json({
    message: " Deleted Sucessfully!",
  });
};
