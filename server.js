const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
const path = require("path");
require("dotenv").config();

//app
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//db
mongoose
  .connect(
    "mongodb+srv://sofiene:20224267aa@komparcrm.bncygkp.mongodb.net/test"
  )
  .then(() => {
    console.log("conected to mdb");
  })
  .catch((err) => {
    console.log(err.message);
  });

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

//routes middleware
readdirSync("./routes").map((r) => {
  const route = require(`./routes/${r}`);
  if (route && typeof route === "function") {
    app.use("/api", route);
    console.log(`Route ${r} loaded successfully.`);
  } else {
    console.error(
      `Failed to load route ${r}. Expected a function but got:`,
      route
    );
  }
});

//port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running on port ${port}`));
