import { AdminModel } from "../models/admin.model";
import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";
import { IssueStatusHistoryModel } from "../models/issueStatusHistory.model";
import mongoose from "mongoose";

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

    const { fullName, email, phonenumber, department } = req.body;

    if (!fullName || !email || !phonenumber || !department) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

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
    const { status } = req.body;
    const adminId = req.adminId;

    const validStatuses = [
      "Reported",
      "In Progress",
      "Resolved",
      "Rejected",
      "Pending",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const updatedIssue = await IssueModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedIssue) {
      res.status(404).json({ message: "Issue not found" });
      return;
    }
    // Creating a record in IssueStatusHistory for this status change

    await IssueStatusHistoryModel.create({
      issueID: new mongoose.Types.ObjectId(id),
      status,
      handledBy: new mongoose.Types.ObjectId(adminId!),
      changedBy: new mongoose.Types.ObjectId(adminId!), // original reporter, optional
      changedAt: new Date(), // optional if timestamps enabled
    });

    res.json({ message: "Issue updated successfully", issue: updatedIssue });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getHandledIssuesByAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const authReq = req as AuthRequest;
  try {
    const adminId = authReq.adminId; // from authMiddleware

    if (!adminId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const historyRecords = await IssueStatusHistoryModel.aggregate([
  {
    $match: {
      handledBy: new mongoose.Types.ObjectId(adminId),
      status: { $in: ["In Progress", "Resolved","Pending","Rejected"] },
    },
  },
  {
    $sort: { changedAt: -1 },
  },
  {
    $group: {
      _id: "$issueID",
      latestRecord: { $first: "$$ROOT" },
    },
  },
  {
    $replaceRoot: { newRoot: "$latestRecord" },
  },
  {
    $lookup: {
      from: "issues",
      localField: "issueID",
      foreignField: "_id",
      as: "issueDetails",
    },
  },
  {
    $unwind: "$issueDetails",
  },
  {
    $project: {
      status: 1,
      handledBy: 1,
      lastStatus: "$status",
      lastUpdated: "$changedAt",
      issueDetails: 1,
    },
  },
]);
const issues = historyRecords.map((record) => ({
  ...record.issueDetails,
  status: record.status,
  handledBy: record.handledBy,
  lastStatus: record.lastStatus,
  lastUpdated: record.lastUpdated,
  isRejected: record.status === "Rejected",
}));


    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching handled issues:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteIssueByAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loggedInAdminId = req.adminId; // from auth middleware
    const { issueid } = req.params;

    // Validate issueid format
    if (!mongoose.Types.ObjectId.isValid(issueid)) {
      res.status(400).json({ message: "Invalid issue ID format" });
      return;
    }
    // If allowing any admin to delete:

    const result = await IssueModel.deleteOne({ _id: issueid });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Issue not found or unauthorized" });
      return;
    }
    res.json({ message: "Deleted Successfully!" });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
