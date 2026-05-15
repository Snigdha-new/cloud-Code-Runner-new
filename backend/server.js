const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
//new added
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

/* ================== MONGODB CONNECTION ================== */

mongoose.connect("mongodb://madirajuis23_db_user:1996S2005@ac-gjon4eh-shard-00-00.c51cmha.mongodb.net:27017,ac-gjon4eh-shard-00-01.c51cmha.mongodb.net:27017,ac-gjon4eh-shard-00-02.c51cmha.mongodb.net:27017/codeRunner?ssl=true&replicaSet=atlas-srkqtw-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* ================== SCHEMA ================== */

const Project = mongoose.model("Project", {
  name: String,
  code: String,
  userId: String,
});

//new added
const User = mongoose.model("User", {
  username: String,
  password: String,
});

/* ================== ROUTES ================== */

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

//new added
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

    // create token
    const token = jwt.sign(
      { id: user._id },
      "secretkey"
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

  const code = req.body.code;

  const filePath = path.join(__dirname, "temp.py");

  fs.writeFileSync(filePath, code);

  let dir = __dirname.replace(/\\/g, "/");
  dir = dir.replace(/^([A-Z]):/, (match, p1) => `/${p1.toLowerCase()}`);

  const command = `docker run --rm -v ${dir}:/app -w /app python:3.11-alpine python temp.py`;

  exec(command, (error, stdout, stderr) => {
    try {
      fs.unlinkSync(filePath);
    } catch {}

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
    const { name, code } = req.body;

    const project = new Project({
      name,
      code,
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

//2 new
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch {
    res.json({ error: "Invalid token" });
  }
}

/* ================== SERVER ================== */

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});