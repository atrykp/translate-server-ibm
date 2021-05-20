const express = require("express");
const cors = require("cors");
require("dotenv").config();
const translateRouter = require("./routes/translate");
const app = express();
const port = process.env.PORT || 5000;
app.listen(port);
app.use(express.json({ limit: "1mb" }));

const corsOptions = {
  origin: [
    "https://pensive-lalande-2ecd72.netlify.app",
    "http://localhost:3000",
  ],
};

app.use("/translator", cors(corsOptions), translateRouter);
