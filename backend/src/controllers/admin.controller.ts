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

    const { fullName, email, phonenumber, department, } = req.body;

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

    const validStatuses = ["Reported", "In Progress", "Resolved", "Rejected", "Pending"];
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

    // Create a record in IssueStatusHistory for this status change
    await IssueStatusHistoryModel.create({
      issueID: new mongoose.Types.ObjectId(id),
      status,
      handledBy: new mongoose.Types.ObjectId(adminId!),
      changedBy: updatedIssue.citizenId, // original reporter, optional
      changedAt: new Date(), // optional if timestamps enabled
    });

    res.json({ message: "Issue updated successfully", issue: updatedIssue });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getHandledIssuesByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // use 'id' if route param is ':id'

    console.log("Fetching handled issues for admin:", id);

    const historyRecords = await IssueStatusHistoryModel.find({
      handledBy: id, // use 'id' here
      status: { $in: ["In Progress", "Resolved"] },
    })
      .populate("issueID")
      .sort({ changedAt: -1 })
      .lean();

    console.log(`Found ${historyRecords.length} records.`);
    historyRecords.forEach(r => {
      console.log(`issueID populated: ${r.issueID ? "yes" : "no"}, status: ${r.status}`);
    });

    const issues = historyRecords
      .filter(record => record.issueID)
      .map(record => ({
        ...record.issueID,
        handledBy: record.handledBy,
        lastStatus: record.status,
        lastUpdated: record.changedAt,
      }));

    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching handled issues:", error);
    res.status(500).json({ success: false, message: "Server Error" });
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
