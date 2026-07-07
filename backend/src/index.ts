import express from "express";
import dotenv from "dotenv";

import connectDb from "./db/connectDb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDb();
  console.log(`Server is running on ${PORT}`);
});
