import "dotenv/config";
import express from "express";
import { UserModel } from "./db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config"; // Consider loading JWT_PASSWORD from environment variables for production.

const app = express();
app.use(express.json());

// user api's =>

app.post("/api/v1/signup/user", async (req, res) => {
  //add zod validation, password hashing

  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  try {
    await UserModel.create({
      username,
      password,
      email,
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
});

app.post("/api/v1/signin/user", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username,
    password,
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );
    res.json({
      token,
    });
  } else {
    res.status(411).json({
      message: "Incorrect Credentials!",
    });
  }
});

app.post("/api/v1/create/issue/user", (req, res) => {});

app.get("/api/v1/issue/user", (req, res) => {});

app.delete("/api/v1/issue/user", (req, res) => {});

//admin api's
app.post("/api/v1/signup/admin", (req, res) => {});

app.post("/api/v1/signin/admin", (req, res) => {});

app.get("/api/v1/issue/admin", (req, res) => {});

app.listen(3000);
