/** @format */

const userModel = require("../Model/userModel");
const asynchandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Hashing password for secure password by BCRYPT
const hashingPassword = asynchandler(async (password) => {
  const IncPassword = await bcrypt.hash(password, 12);
  return IncPassword;
});

// Creating new user
const register = asynchandler(async (req, res) => {
  const { FirstName, LastName, Email, Phone, UserName, Password } = req.body;

  // all fields are required
  if (!FirstName || !LastName || !Email || !Phone || !UserName || !Password) {
    return res.status(204).json({ message: "All fields are required..!" });
  }

  // Check if user allready exists
  const userExists = await userModel.findOne({ Email: Email });
  const userNameExists = await userModel.findOne({ UserName });

  if (userExists) {
    return res.status(409).json({ message: "User allready exists..!" });
  }

  if (userNameExists) {
    return res.status(409).json({ message: "UserName allready exists..!" });
  }

  const IncPassword = await hashingPassword(Password);

  const user = new userModel({
    FirstName,
    LastName,
    Email,
    Phone,
    UserName,
    Password: IncPassword,
  });
  await user.save();
  return res.status(201).json({ message: "Registered Successfully" });
});

// Get User Details
const getUser = asynchandler(async (req, res) => {
  const user = req.user;
  await userModel.find({ _id: user._id }).select("-Password").lean();

  // if no user found
  if (!user) {
    return res.status(400).json({ message: "No Users Found" });
  }
  return res.status(200).json({ user });
});

// Get User By Id
const getUserById = asynchandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findById({ _id: id });

  // If User not found
  if (!user) {
    return res.status(404).json({ message: "User not found.." });
  }

  return res.status(200).json({ user });
});

// Delete Account or Delete user
const deleteUser = asynchandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.findOne({ _id: id });
  // Check if user is available or not
  if (!user) {
    return res.status(404).json({ message: "User not found.." });
  }

  // Delete action
  await userModel.findByIdAndDelete({ _id: id });
  return res.status(200).json({ message: "Account Deleted Successfully.." });
});

// Login
const login = asynchandler(async (req, res) => {
  const { Email, userName, Password } = req.body;

  // Checking user exists or not
  const user = await userModel.findOne({ Email });
  if (!user) {
    return res.status(404).json({ message: "User not found.." });
  }

  const isMatched = await bcrypt.compare(Password, user.Password);
  // If Password is incorrect
  if (!isMatched) {
    return res.status(401).json({ message: "Incorrect Password.." });
  }

  const token = await jwt.sign({ _id: user._id }, process.env.SECRETE_KEY, {
    expiresIn: "1h",
  });

  if (user) {
    return res
      .cookie("jwt_token", token, {
        httpOnly: true,
        sameSite: "none",
        withCredentials: true,
        secure: true,
      })
      .status(200)
      .send({ message: "Logged in successfully", user: user, token: token });
  } else {
    return res.status(500).json({ message: "Invalid Credientials.." });
  }
});

const logout = asynchandler(async (req, res) => {
  return res
    .clearCookie("jwt_token", {
      httpOnly: true,
      secure: true,
      withCredentials: true,
      sameSite: "none",
    })
    .json({ message: "Logged out successfully" });
});

// Update Information
const updateProfile = asynchandler(async (req, res) => {
  const { FirstName, LastName, Email, Phone, UserName } = req.body;
  const id = req.params.id;

  if (!FirstName || !LastName || !Email || !Phone || !UserName) {
    return res.status(204).json({ message: "All fields are required" });
  }

  const user = await userModel.findById({ _id: id });
  if (!user) {
    return res.status(404).json({ message: "User Not found" });
  }
  const updatedUser = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      FirstName,
      LastName,
      Email,
      Phone,
      UserName,
    },
    {
      new: true,
    }
  );

  if (updatedUser) {
    return res.status(200).json({ message: "Profile Updated SuccessFully" });
  } else {
    return res.status(404).json({ message: "SomeThing went wrong" });
  }
});

const updatePassword = asynchandler(async (req, res) => {
  const id = req.params.id;
  const { Password } = req.body;

  const user = await userModel.findById({ _id: id });
  if (!user) {
    return res.status(409).json({ message: "User not found" });
  }
  const incPass = await hashingPassword(Password);
  const updatedPassword = await userModel.findByIdAndUpdate(
    { _id: user._id },
    {
      $set: {
        Password: incPass,
      },
    },
    { new: true }
  );

  if (updatedPassword) {
    return res.status(200).json({ 'message': "Password updated successfully" })
  } else {
    return res.status(500).json({ 'message': 'SomeThing went wrong' })
  }
});

module.exports = {
  register,
  getUser,
  deleteUser,
  login,
  logout,
  updateProfile,
  getUserById,
  updatePassword,
};
