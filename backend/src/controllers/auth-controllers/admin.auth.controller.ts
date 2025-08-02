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
    .length(10, { message: "Phone number must be exactly 10 digits" })
    .trim(),
  department: z.string().trim(),
  adminAccessCode: z
    .number()
    .int()
    .min(1000, { message: "Admin access code must be at least 4 digits" }),
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
  
    //Check if the admin already exists
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: " User already exists" });
      return;
    }

    //Hash password and create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    await AdminModel.create({
      fullName,
      password: hashedPassword,
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
      return;
    }

    console.error("Error creating admin:", err);
    res
      .status(411)
      .json({ message: "Admin already exists or another error occurred" });
  }
};

export const adminSignin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, adminAccessCode } = req.body;

    // Find admin by email and access code
    const existingUser = await AdminModel.findOne({
      email,
      adminAccessCode,
    });
    if (!existingUser) {
      res.status(404).json({ message: "Admin not found!" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password as string
    );
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: existingUser._id,
        role: "admin",
      },
      process.env.JWT_PASSWORD!,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        adminAccessCode: existingUser.adminAccessCode,
        department: existingUser.department,
        phonenumber: existingUser.phonenumber,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Error during admin signin:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
