import { Request, Response } from "express";
import { AdminModel } from "../../models/admin.model";
import jwt from "jsonwebtoken";

export const adminSignup = async (req: Request, res: Response) => {
  const password = req.body.password;
  const email = req.body.email;
  const fullname = req.body.fullname;
  const phonenumber = req.body.phonenumber;
  const department = req.body.department;
  const position = req.body.position;
  const adminAccessCode = req.body.adminAccessCode;

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
  const email = req.body.email;
  const password = req.body.password;
  const adminAccessCode = req.body.adminAccessCode;

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
