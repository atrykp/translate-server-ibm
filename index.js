const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const translateRouter = require("./routes/translate");
const userRouter = require("./routes/users");

const app = express();

const port = process.env.PORT || 5000;
const corsOptions = {
  origin: [
    "https://pensive-lalande-2ecd72.netlify.app",
    "http://localhost:3000",
  ],
};

app.use(express.json({ limit: "1mb" }));
app.use("/translator", cors(corsOptions), translateRouter);
app.use("/api/users", cors(corsOptions), userRouter);

app.listen(port);

mongoose.connect(
  process.env.MONGODB_LINK,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Database Connected...")
);
