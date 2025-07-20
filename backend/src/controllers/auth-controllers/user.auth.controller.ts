import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user.model";
import { z } from "zod";

//User Signup =>

const signupSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    )
    .trim(),
  email: z.string().email({ message: "Invalid email format" }).trim(),
  phonenumber: z
    .string()
    .length(10, { message: "Phone number must be exactly 10 digits" }),
});

export const userSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedData = signupSchema.parse(req.body);
    const { fullName, password, email, phonenumber } = parsedData;
    if (!fullName || !password || !email || !phonenumber) {
      res.status(400).json({ message: "Please fill all the fields" });
    }

    await UserModel.create({
      fullName,
      password,
      email,
      phonenumber,
    });
    console.log("User created!");
    res.status(200).json({ message: "User Signed up!" });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }

    console.error("Error creating user:", err);
    res
      .status(411)
      .json({ message: "User already exists or another error occurred" });
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
        user: {
          id: existingUser._id,
          fullName: existingUser.fullName,
          email: existingUser.email,
          role: "Citizen",
        },
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
