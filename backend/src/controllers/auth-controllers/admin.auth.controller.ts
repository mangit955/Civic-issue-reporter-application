import { Request, Response } from "express";
import { AdminModel } from "../../models/admin.model";
import jwt from "jsonwebtoken";

export const adminSignup = async (req: Request, res: Response) => {
  const {
    fullname,
    password,
    email,
    phonenumber,
    department,
    position,
    adminAccessCode,
  } = req.body;

  if (
    !password ||
    !email ||
    !fullname ||
    !phonenumber ||
    !department ||
    !position ||
    !adminAccessCode
  ) {
    res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  try {
    await AdminModel.create({
      fullname,
      password,
      email,
      phonenumber,
      department,
      position,
      adminAccessCode,
    });
    console.log("Admin created!");

    res.status(200).json({
      message: "Admin Signed up!",
    });
  } catch (e) {
    console.error("Error creating admin:", e);
    res.status(411).json({
      message: "Admin already exists",
    });
  }
};

export const adminSignin = async (req: Request, res: Response) => {
  const { email, password, adminAccessCode } = req.body;

  const existingUser = await AdminModel.findOne({
    email,
    password,
    adminAccessCode,
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_PASSWORD!
    );
    res.json({
      token,
    });
  } else {
    res.status(411).json({
      message: "Incorrect Credentials!",
    });
  }
};

//  "username" : ""
//  "password ": ""
//  "email" : ""
//  "fullname" : ""
//  "phonenumber" : ""
//  "department" : ""
//  "position" : ""
