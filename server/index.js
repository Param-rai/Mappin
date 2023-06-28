import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pinRoute from "./routes/pins.js";
import userRoute from "./routes/users.js";
import cors from "cors";
const app = express();

dotenv.config();

//middlewares
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(8000, () => {
  console.log("Sever is running...");
});

// routes
app.use("/api/pins", pinRoute);
app.use("/api/user", userRoute);
