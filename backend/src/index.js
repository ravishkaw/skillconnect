const express = require("express");
const app = express();
const connectToDB = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const protect = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello World! Welcome to the skillconnect API</h1>");
});

app.use("/api/", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/jobs", protect, jobRoutes);
app.use("/api/proposals", protect, proposalRoutes);
app.use("/api/projects", protect, projectRoutes);

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
