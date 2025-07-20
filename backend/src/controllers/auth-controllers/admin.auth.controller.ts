import { Request, Response } from "express";
import { AdminModel } from "../../models/admin.model";
import jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcryptjs";

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
  department: z.string().trim(),
  adminAccessCode: z.number().int().positive().min(4, {
    message: "Admin access code must be at least 4 digits",
  }),
});

export const adminSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedData = signupSchema.parse(req.body);
    const {
      fullName,
      password,
      email,
      phonenumber,
      department,
      adminAccessCode,
    } = parsedData;

    if (
      !fullName ||
      !password ||
      !email ||
      !phonenumber ||
      !department ||
      !adminAccessCode
    ) {
      res.status(400).json({ message: "Please fill all the fields" });
    }

    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: " User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await AdminModel.create({
      fullName,
      password,
      email,
      phonenumber,
      department,
      adminAccessCode,
    });
    console.log("Admin created!");
    res.status(200).json({ message: "Admin Signed up!" });
  } catch (err: any) {
    if (err.name === "ZodError") {
      res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }

    console.error("Error creating admin:", err);
    res
      .status(411)
      .json({ message: "Admin already exists or another error occurred" });
  }
};

export const adminSignin = async (req: Request, res: Response) => {
  const { email, password, adminAccessCode } = req.body;

  const existingUser = await AdminModel.findOne({
    email,
    password,
    adminAccessCode,
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
    }
  } catch (error) {
    console.error("Error during admin signin:", error);
    res.status(500).json({
      message: "Internal Server Error",
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
