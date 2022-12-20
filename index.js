const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db.connect");
const User = require("./model/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT;

app.use(express.json(), cors());

app.get("/", (req, res) => {
  res.send("home");
});

app.post("/alluser/signup", async (req, res) => {
  const { user_name, email, password } = req.body;
  let existinguser;
  try {
    existinguser = await User.findOne({ email });
  } catch (err) {
    return console.log("err");
  }
  if (existinguser) {
    return res.status(400).json({ message: "user already exist", error: true });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    user_name,
    email,
    password: hashedPassword,
  });

  try {
    user.save();
  } catch (err) {
    console.log(err);
  }
  return res
    .status(202)
    .json({ message: "signup success", error: false, user });
});

app.post("/alluser/login", async (req, res) => {
  const { email, password } = req.body;
  let existinguser;
  try {
    existinguser = await User.findOne({ email });
  } catch (err) {
    return console.log("err");
  }
  if (!existinguser) {
    return res
      .status(404)
      .json({ message: "could not find user by this credential", error: true });
  }
  const ispasswordcorrect = bcrypt.compareSync(password, existinguser.password);
  if (!ispasswordcorrect) {
    return res
      .status(400)
      .json({ message: "Invalid Credentials", error: true });
  }
  const token = jwt.sign(
    {
      name: existinguser.name,
      id: existinguser._id,
    },
    "SECRET"
  );
  return res.status(200).json({
    message: "Login sucessful",
    error: false,
    user: {
      _id: existinguser._id,
      user_name: existinguser.user_name,
      email: existinguser.email,
      token,
    },
  });
});

app.listen(PORT, async () => {
  try {
    await connectDB;
    console.log("connected to db successfully");
  } catch (error) {
    console.log("something went wrong while connecting to db");
  }
  console.log(`Server listening on localhost:${PORT}`);
});
