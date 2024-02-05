const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

mongoose.connect(process.env.Mongodb_Url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
connection.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  canvasData: { type: String, default: null },
});

const User = mongoose.model("User", userSchema);

//Routes

app.get("/", (req, res) => {
  res.send("Welcome to the application!");
});

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
