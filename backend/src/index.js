const express = require("express");
const app = express();
const connectToDB = require("./config/database");
require("dotenv").config();

const startServer = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
