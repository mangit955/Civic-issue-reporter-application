import { IssueModel } from "../models/issue.model";
import { Request, Response } from "express";
import { CitizenModel } from "../models/citizen.model";

interface AuthRequest extends Request {
  citizenId?: string;
}

export const getCitizenProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const citizen = await CitizenModel.findById(id).select("-password");

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

    const updatedCitizen = await CitizenModel.findByIdAndUpdate(
      id,
      { fullName, email, phonenumber, address },
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

export const deleteIssue = async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    citizenId: authReq.citizenId,
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

export const getIssuesBycitizen = async (req: Request, res: Response) => {
  //@ts-ignore
  const citizenId = req.citizenId;
  console.log("citizenId in getIssuesBycitizen:", citizenId);
  const issue = await IssueModel.find({
    citizenId: citizenId,
  }).populate("citizenId", "fullName");

  res.json({
    issue,
  });
};
