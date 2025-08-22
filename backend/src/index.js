const express = require("express");
const app = express();
const connectToDB = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const protect = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  res.send("Hello World");
});

app.use("/api/", authRoutes);
app.use("/api/users", protect, userRoutes);

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
