const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// CORS configuration - allow frontend to call API
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl requests)
    if (!origin) return callback(null, true);
    
    // Whitelist for production (supports multiple domains separated by comma)
    const whitelist = (process.env.CLIENT_URL || "*").split(",").map(url => url.trim());
    
    if (whitelist.includes("*") || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Rejected origin: ${origin}`);
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Health / test route
app.get("/", (req, res) => {
  res.json({ message: "API Running Successfully 🚀" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Global error handler
app.use(errorHandler);

module.exports = app;