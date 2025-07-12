import { Request, Response } from "express";
import { AdminModel } from "../../models/admin.model";
import jwt from "jsonwebtoken";

export const adminSignup = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const fullname = req.body.fullname;
  const phonenumber = req.body.phonenumber;
  const department = req.body.department;
  const position = req.body.position;

  try {
    await AdminModel.create({
      username,
      password,
      email,
      fullname,
      phonenumber,
      department,
      position,
    });
    console.log("Admin created!");

    res.status(200).json({
      message: "Admin Signed up!",
    });
  } catch (e) {
    res.status(411).json({
      message: "Admin already exists",
    });
  }
};

export const adminSignin = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await AdminModel.findOne({
    username,
    password,
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
