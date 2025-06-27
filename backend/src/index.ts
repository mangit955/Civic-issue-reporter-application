import "dotenv/config";
import express, { Request, Response } from "express";
import { IssueModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config"; // Consider loading JWT_PASSWORD from environment variables for production.
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());
interface AuthRequest extends Request {
  userId?: String;
}

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

app.post(
  "/api/v1/create/issue/user",
  userMiddleware,
  async (req: AuthRequest, res: Response) => {
    const type = req.body.type;
    const title = req.body.title || "Untitled";
    const description = req.body.description;
    const location = req.body.location;
    const status = req.body.status;
    const phonenumber = req.body.phonenumber;
    const fullname = req.body.fullname;
    const address = req.body.address;

    await IssueModel.create({
      userId: req.userId,
      title,
      description,
      location,
      status,
      type,
      phonenumber,
      fullname,
      address,
    });

    res.json({
      message: "Content added!",
    });
  }
);

app.get("/api/v1/issue/user", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const issue = await IssueModel.find({
    userId: userId,
  }).populate("userId", "username");

  res.json({
    issue,
  });
});

app.delete("/api/v1/issue/user", userMiddleware, async (req, res) => {
  const authReq = req as AuthRequest;
  const issueId = req.body.issueId;
  const result = await IssueModel.deleteOne({
    _id: issueId,
    userId: authReq.userId,
  });

  if (result.deletedCount === 0) {
    res.status(404).json({
      message: " Content not found !",
    });
  } else {
    res.json({
      message: "Deleted Successfully !",
    });
  }
});

//admin api's
app.post("/api/v1/signup/admin", (req, res) => {});

app.post("/api/v1/signin/admin", (req, res) => {});

app.get("/api/v1/issue/admin", (req, res) => {});

app.listen(3000);

//     "title": "testing",
//     "description":" harzardious",
//     "location": "Atlanta",
//     "status": "false",
//     "type":"damaged road",
//     "phonenumber": "1232343452",
//     "fullname": "Jhon doe",
//     "address": "near aditi's house"
