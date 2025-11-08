import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env before using process.env
console.log("TOKEN_SECRET is:", process.env.TOKEN_SECRET);
import express from "express";
import cors from "cors";
import { db } from "./db/db.js";
import userRoute from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { AuthApi } from "./middlware/AuthApi.js";




const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: ["https://anpadd.vercel.app"], // ✅ frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRoute);

// Protected route example
app.get("/home", AuthApi, (req, res) => {
  console.log(req.userid);
  console.log("route is running");
  return res.send("This is my home page");
});

// Connect DB and start server
db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });


