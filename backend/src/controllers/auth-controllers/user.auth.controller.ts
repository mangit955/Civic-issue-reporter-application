import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user.model";

//User Signup =>
export const userSignup = async (req: Request, res: Response) => {
  const fullname = req.body.fullname;
  const password = req.body.password;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;

  try {
    await UserModel.create({
      fullname,
      password,
      email,
      phonenumber,
    });
    console.log("User created!");

    res.status(200).json({
      message: "User Signed up!",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
};

//User Signin =>

export const userSignin = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    email,
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
