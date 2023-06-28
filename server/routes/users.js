import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
const router = express.Router();

//register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //generate hash pass
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPass,
    });

    //save and send res
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //find user
    const user = await User.findOne({ username });
    !user && res.status(400).json("Wrong credentials");

    //validate password
    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("Wrong credentials");

    res.status(200).json({ _id: user._id, username: username });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

export default router;
