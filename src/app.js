const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// 🔥 MIDDLEWARE
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "API Running Successfully 🚀" });
});

// 🔥 ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// 🔥 DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});