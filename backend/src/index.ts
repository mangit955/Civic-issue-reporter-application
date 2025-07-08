import dotenv from "dotenv";
import { connectDB } from "./config/database";
import app from "./app";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed!\n", error);
    process.exit(1);
  });

// const app = express();
// app.use(express.json());
// interface AuthRequest extends Request {
//   userId?: String;
// }

// // user api's =>

// app.post("/api/v1/signup/user", async (req, res) => {
//   //add zod validation, password hashing

//   const username = req.body.username;
//   const password = req.body.password;
//   const email = req.body.email;

//   try {
//     await UserModel.create({
//       username,
//       password,
//       email,
//     });
//     console.log("User created!");

//     res.status(200).json({
//       message: "User Signed up!",
//     });
//   } catch (e) {
//     res.status(411).json({
//       message: "User already exists",
//     });
//   }
// });

// app.post("/api/v1/signin/user", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   const existingUser = await UserModel.findOne({
//     username,
//     password,
//   });

//   if (existingUser) {
//     const token = jwt.sign(
//       {
//         id: existingUser._id,
//       },
//       JWT_PASSWORD
//     );
//     res.json({
//       token,
//     });
//   } else {
//     res.status(411).json({
//       message: "Incorrect Credentials!",
//     });
//   }
// });

// app.post(
//   "/api/v1/create/issue/user",
//   userMiddleware,
//   upload.array("files", 10),
//   async (req: AuthRequest, res: Response) => {
//     try {
//       const files = req.files as Express.Multer.File[];

//       const media = files.map((file) => ({
//         url: (file as any).path,
//         type: file.mimetype.startsWith("video") ? "video" : "image",
//         filename: file.originalname,
//       }));

//       const type = req.body.type;
//       const title = req.body.title || "Untitled";
//       const description = req.body.description;
//       const location = req.body.location;
//       const status = req.body.status;
//       const phonenumber = req.body.phonenumber;
//       const fullname = req.body.fullname;
//       const address = req.body.address;

//       await IssueModel.create({
//         userId: req.userId,
//         title,
//         description,
//         location,
//         status,
//         type,
//         phonenumber,
//         fullname,
//         address,
//         media,
//       });

//       res.json({
//         message: "Content added!",
//         uploadedMedia: media,
//       });
//     } catch (e) {
//       console.error("Error while creating issue:", e);
//       res.status(500).json({
//         message: "Inernal server error",
//       });
//     }
//   }
// );

// app.get("/api/v1/issue/user", userMiddleware, async (req, res) => {
//   //@ts-ignore
//   const userId = req.userId;
//   const issue = await IssueModel.find({
//     userId: userId,
//   }).populate("userId", "username");

//   res.json({
//     issue,
//   });
// });

// app.delete("/api/v1/issue/user", userMiddleware, async (req, res) => {
//   const authReq = req as AuthRequest;
//   const issueId = req.body.issueId;
//   const result = await IssueModel.deleteOne({
//     _id: issueId,
//     userId: authReq.userId,
//   });

//   if (result.deletedCount === 0) {
//     res.status(404).json({
//       message: " Content not found !",
//     });
//   } else {
//     res.json({
//       message: "Deleted Successfully !",
//     });
//   }
// });

// //admin api's =>

// app.post("/api/v1/signup/admin", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const email = req.body.email;
//   const fullname = req.body.fullname;
//   const phonenumber = req.body.phonenumber;
//   const department = req.body.department;
//   const position = req.body.position;

//   try {
//     await AdminModel.create({
//       username,
//       password,
//       email,
//       fullname,
//       phonenumber,
//       department,
//       position,
//     });
//     console.log("User created!");

//     res.status(200).json({
//       message: "Admin Signed up!",
//     });
//   } catch (e) {
//     res.status(411).json({
//       message: "Admin already exists",
//     });
//   }
// });

// app.post("/api/v1/signin/admin", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   const existingUser = await AdminModel.findOne({
//     username,
//     password,
//   });

//   if (existingUser) {
//     const token = jwt.sign(
//       {
//         id: existingUser._id,
//       },
//       JWT_PASSWORD
//     );
//     res.json({
//       token,
//     });
//   } else {
//     res.status(411).json({
//       message: "Incorrect Credentials!",
//     });
//   }
// });

// app.get("/api/v1/issue/admin", async (req, res) => {
//   try {
//     const issue = await IssueModel.find({}).populate("userId", "username");
//     res.json({
//       issue,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Something went wrong",
//     });
//   }
// });

// app.delete("/api/v1/issue/admin/delete", userMiddleware, async (req, res) => {
//   const authReq = req as AuthRequest;
//   const issueId = req.body.issueId;
//   const result = await IssueModel.deleteOne({
//     _id: issueId,
//     userId: authReq.userId,
//   });

//   if (result.deletedCount === 0) {
//     res.status(404).json({
//       message: "Issue not found",
//     });
//   } else {
//     res.json({
//       message: " Deleted Sucessfully!",
//     });
//   }
// });

// app.listen(3000);

// //     "title": "testing",
// //     "description":" harzardious",
// //     "location": "Atlanta",
// //     "status": "false",
// //     "type":"damaged road",
// //     "phonenumber": "1232343452",
// //     "fullname": "Jhon doe",
// //     "address": "near aditi's house"
