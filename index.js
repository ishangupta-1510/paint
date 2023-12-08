const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

mongoose
  .connect(process.env.Mongodb_Url)
  .then(() => {
    console.log("connection is succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  canvasData: { type: String, default: null },
});

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/getCanvasData", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.send({ canvasData: user.canvasData });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/saveCanvas", async (req, res) => {
  const { userId, canvasData } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { canvasData: canvasData });
    res.send({ message: "Canvas data saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (password === user.password) {
        // Send both user info and canvas data
        res.send({
          message: "Login Successful",
          user: user,
          canvasData: user.canvasData,
        });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    useExist = await User.findOne({ email: email });
    if (useExist) {
      res.send({ message: "this email already exit" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      console.log(user);

      await user.save();
      res.send("user register succesfully");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
