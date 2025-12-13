import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json({limit:'16kb'}))
app.use(cookieParser());
app.set("trust proxy", 1);



import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";

app.use('/api/tasks',taskRouter)
app.use('/api/auth',userRouter)

export default app;
