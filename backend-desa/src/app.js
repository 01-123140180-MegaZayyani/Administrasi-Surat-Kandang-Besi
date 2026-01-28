// backend/src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// -----------------------------
// 💡 CORS CONFIGURATION
// -----------------------------
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman / server-to-server
    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.warn("🚫 Blocked CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// 💡 DATABASE (PostgreSQL - Prisma)
// -----------------------------
// try {
//   require("./utils/verifyPostgresConnection"); // optional, just logs
//   console.log("📌 PostgreSQL (Neon) Verifier Loaded");
// } catch (err) {
//   console.warn("⚠ DB Verifier not loaded:", err.message);
// }

// -----------------------------
// 💡 TEST ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend Administrasi Surat Desa berjalan 🚀",
  });
});

// -----------------------------
// 💡 ROUTES
// -----------------------------
try {
  app.use("/api/auth", require("./routes/auth/authRoutes"));
} catch (err) {
  console.warn("⚠ authRoutes missing:", err.message);
}

try {
  app.use("/api/admin", require("./routes/admin/adminRoutes"));
} catch (err) {
  console.warn("⚠ adminRoutes missing:", err.message);
}

try {
  app.use("/api/surat", require("./routes/suratRoutes"));
} catch (err) {
  console.warn("⚠ suratRoutes missing:", err.message);
}

// -----------------------------
// 💡 404 HANDLER
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// -----------------------------
// 💡 GLOBAL ERROR HANDLER
// -----------------------------
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// -----------------------------
// 💡 START SERVER
// -----------------------------
const PORT = process.env.PORT || 6543;

app.listen(PORT, () => {
  console.log(`🟢 Server berjalan di port ${PORT}`);
  console.log("🌐 Allowed Origins:", allowedOrigins);
});

module.exports = app;