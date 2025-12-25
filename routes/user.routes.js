const express = require('express')
const { UserModel } = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userRouter = express.Router()


userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Save new user
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    res.send("Registered successfully");
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).send("Server error");
  }
})

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, "mysecret", { expiresIn: "2h" });

  res.status(200).json({
    token,
    name: user.name, // ✅ this is critical
  });
})

// const jwt = require("jsonwebtoken");

userRouter.get("/find", (req, res) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, 'mysecret', async (err, decoded) => {
      if (err) {
        console.log("Token error:", err);
        return res.status(401).json({ msg: "Invalid token" });
      }

      if (decoded) {
        try {
          const data = await UserModel.findById(decoded.id); // or decoded.id
          console.log(data);
          return res.json(data); // ✅ Send JSON response
        } catch (error) {
          console.log("DB error:", error);
          return res.status(500).json({ msg: "Server error" });
        }
      } else {
        return res.status(401).json({ msg: "Login first to authenticate" });
      }
    });
  } else {
    return res.status(400).json({ msg: "Token missing" }); // ✅ Always send JSON
  }
});


module.exports = { userRouter }