import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user.model";

//User Signup =>
export const userSignup = async (req: Request, res: Response) => {
  const { fullName, password, email, phonenumber } = req.body;

  if (!fullName || !password || !email || !phonenumber) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }

  try {
    await UserModel.create({
      fullName,
      password,
      email,
      phonenumber,
    });
    console.log("User created!");

    res.status(200).json({
      message: "User Signed up!",
    });
  } catch (e) {
    console.error("Error creating user:", e);
    res.status(411).json({
      message: "User already exists",
    });
  }
};

//User Signin =>

export const userSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findOne({
    email,
    password,
  });

  try {
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
      console.log("User signed in!");
    }
  } catch (error) {
    console.error("Error during user signin:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
