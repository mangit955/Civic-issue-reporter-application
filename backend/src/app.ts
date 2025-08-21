import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import citizenRoutes from "./routes/citizen.routes";
import issueRoutes from "./routes/issue.routes";

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN ?? "").split(",");

app.use(
  cors({
    origin: function (origin, callback){
      if(!origin || allowedOrigins.includes(origin)){
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


// routes declaration

app.use("/api/v1", citizenRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1", issueRoutes);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});
app.get('/', (req, res) => {
  res.send('Civic Issue Reporter Backend is Running');
});


export default app;
