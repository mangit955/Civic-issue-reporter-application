import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";
import { CitizenModel } from "../models/citizen.model";

interface AuthRequest extends Request {
  citizenId?: string;
}

export const getCitizenProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const loggedInCitizenId = req.citizenId;

    const citizen = await CitizenModel.findById(loggedInCitizenId)
      .select("-password")
      .lean();

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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const loggedInCitizenId = req.citizenId;

    if (id !== loggedInCitizenId) {
      res.status(403).json({ message: "Unauthorised Citizen access" });
      return;
    }

    const { fullName, email, phonenumber } = req.body;

    if (!fullName || !email || !phonenumber) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const updatedCitizen = await CitizenModel.findByIdAndUpdate(
      id,
      { fullName, email, phonenumber },
      { new: true }
    );

    if (!updatedCitizen) {
      res.status(404).json({ message: "Citizen not found" });
      return;
    }

    res.json({
      message: "Profile updated successfully",
      citizen: updatedCitizen,
    });
  } catch (error) {
    console.error("Error updating citizen profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getIssuesByCitizen = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  try {
    const citizenId = authReq.citizenId;
    if (!citizenId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const issues = await IssueModel.find({ citizenId })
      .populate("citizenId", "fullName")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteIssue = async (req: AuthRequest, res: Response) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    citizenId: authReq.citizenId,
  });

  try {
    const { id } = req.params;
    const loggedInCitizenId = req.citizenId;

    if (id !== loggedInCitizenId) {
      res.status(403).json({ message: "Unauthorised Citizen access" });
      return;
    }
    if (result.deletedCount === 0) {
      res.status(404).json({
        message: " Content not found !",
      });
      return;
    }
    res.json({
      message: "Deleted Successfully !",
    });
  } catch (error) {
    console.error("Error deleting issue:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
