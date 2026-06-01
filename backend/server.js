require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

const bcrypt_require = require("bcryptjs");
const jwt_require = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

/* ================== ENVIRONMENT VARIABLES ================== */

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://madirajuis23_db_user:1996S2005@ac-gjon4eh-shard-00-00.c51cmha.mongodb.net:27017,ac-gjon4eh-shard-00-01.c51cmha.mongodb.net:27017,ac-gjon4eh-shard-00-02.c51cmha.mongodb.net:27017/?ssl=true&replicaSet=atlas-13vz6n-shard-0&authSource=admin&retryWrites=true&w=majority";
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

/* ================== MONGODB CONNECTION ================== */

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

/* ================== SCHEMA ================== */

const Project = mongoose.model("Project", {
  name: String,
  code: String,
  language: String,
  userId: String,
});

const User = mongoose.model("User", {
  username: String,
  password: String,
});

/* ================== ROUTES ================== */

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.log(err);
    res.json({ error: "Signup failed" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ error: "User not found" });
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ error: "Invalid password" });
    }

    // create token using JWT_SECRET from env
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.log(err);
    res.json({ error: "Login failed" });
  }
});

/* ---------- RUN CODE ---------- */
app.post("/run", (req, res) => {
  console.log("Request received");

  const { code, language } = req.body;

  console.log("Language:", language);

  let fileName = "";
  let command = "";

  // PYTHON
  if (language === "python") {
    fileName = "temp.py";
  }
  // JAVASCRIPT
  else if (language === "javascript") {
    fileName = "temp.js";
  }
  // INVALID
  else {
    return res.json({
      error: "Unsupported language",
    });
  }

  const filePath = path.join(__dirname, fileName);

  fs.writeFileSync(filePath, code);

  let dir = __dirname.replace(/\\/g, "/");

  dir = dir.replace(
    /^([A-Z]):/,
    (match, p1) => `/${p1.toLowerCase()}`
  );

  // PYTHON
  if (language === "python") {
    command =
      `docker run --rm -v ${dir}:/app -w /app python:3.11-alpine python ${fileName}`;
  }
  // JAVASCRIPT
  else if (language === "javascript") {
    command =
      `docker run --rm -v ${dir}:/app -w /app node:20-alpine node ${fileName}`;
  }

  console.log("Running command:", command);

  exec(command, (error, stdout, stderr) => {
    try {
      fs.unlinkSync(filePath);
    } catch {}

    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (error) {
      return res.json({
        error: stderr || "Execution error",
      });
    }

    res.json({
      output: stdout || stderr || "No output",
    });
  });
});

/* ---------- SAVE PROJECT ---------- */
app.post("/save", verifyToken, async (req, res) => {
  try {
    const { name, code, language } = req.body;

    const project = new Project({
      name,
      code,
      language,
      userId: req.user.id,
    });

    await project.save();

    res.json({
      message: "Saved successfully",
    });

  } catch (err) {
    console.log(err);
    res.json({
      error: "Save failed",
    });
  }
});

/* ---------- GET PROJECTS ---------- */
app.get("/projects", verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.id,
    });

    res.json(projects);

  } catch (err) {
    console.log(err);
    res.json([]);
  }
});

/* ================== MIDDLEWARE ================== */

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.json({ error: "Invalid token" });
  }
}

/* ================== SERVE FRONTEND IN PRODUCTION ================== */

if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

/* ================== START SERVER ================== */

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
