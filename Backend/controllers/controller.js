const User = require("../models/user");
const Task = require("../models/task");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/errorHandler");

// Function to handle with errors
const handleErrors = (err) => {
  const errors = {};

  // errors from db model
  if (err.message.includes("validation failed")) {
    Object.values(err.errors).map((error) => {
      errors[error.properties.path] = error.properties.message;
    });
  }

  // error if email is exists!
  if (err.code === 11000) {
    errors["email"] = "This email is already exist, please login!";
  }

  //If both passwords is not equal?
  if (err.message.includes("Both passwords must be equal!")) {
    errors["confPass"] = "Both passwords must be equal!";
  }

  //Login messages
  if (err.message.includes("User is not found, please signup!")) {
    errors["email"] = "User is not found, please signup!";
  }

  if (err.message.includes("Password is not correct")) {
    errors["password"] = "Password is not correct";
  }

  //Reset password messages
  if (err.message.includes("This field is required")) {
    errors["password"] = "This field is required";
  }

  return errors;
};

// Functions to create access and refresh tokens
const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

//Function to create new user
const post_signup = async (req, res) => {
  const { username, email, password, confPass } = req.body;

  //   Check if there is errors comes from the routes ?
  const result = validationResult(req);
  const errors = {};

  if (!result.isEmpty()) {
    result.array().map((error) => {
      errors[error.path] = error.msg;
    });
    return res.status(400).json({ success: false, errors });
  }

  try {
    // Create a verificationCode to send it to the user
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    //Send Email to the user
    await sendEmail({
      to: email,
      subject: `كود تأكيد الحساب`,
      text: `كود تأكيد الحساب هو ${verificationCode}`,
    });

    const avatar = req.file ? `uploads/${req.file.filename}` : null;

    //Create new user in db but not verified
    const user = await User.create({
      username,
      email,
      password,
      confPass,
      avatar,
      verificationCode,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ success: false, errors });
  }
};

//Function to Verify code
const post_verify = async (req, res, next) => {
  const { code, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User is not found!" });
    }

    if (user.verificationCode !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Code is not correct!" });
    }

    await User.findByIdAndUpdate(userId, {
      verificationCode: null,
      isVerified: true,
    });

    //Create access and refresh tokens
    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);

    // send cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const post_login = async (req, res) => {
  const { email, password } = req.body;

  //   Check if there is errors comes from the routes ?
  const result = validationResult(req);
  const errors = {};

  if (!result.isEmpty()) {
    result.array().map((error) => {
      errors[error.path] = error.msg;
    });
    return res.status(400).json({ success: false, errors });
  }

  try {
    const user = await User.login(email, password);

    //Create access and refresh tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // send cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);

    const errors = handleErrors(error);
    res.status(400).json({ success: false, errors });
  }
};

// Function to handle with email forgot password
const post_forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User is not found" });
    }

    const resetPasswordCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // ارسال الايميل
    await sendEmail({
      to: email,
      subject: "كود تغيير كلمة المرور",
      text: `كود تغيير كلمة المرور هو ${resetPasswordCode}`,
    });

    await User.findByIdAndUpdate(user._id, {
      verificationCode: resetPasswordCode,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Function to reset password
const post_resetPassword = async (req, res, error) => {
  const { userId, code, newPassword, retypePassword } = req.body;

  //   Check if there is errors comes from the routes ?
  const result = validationResult(req);
  const errors = {};

  if (!result.isEmpty()) {
    result.array().map((error) => {
      errors[error.path] = error.msg;
    });
    return res.status(400).json({ success: false, errors });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, errors: { confPass: "User is not found!" } });
    }

    if (user.verificationCode !== code) {
      return res
        .status(400)
        .json({ success: false, errors: { code: "Code is not correct" } });
    }

    if (newPassword !== retypePassword) {
      return res.status(400).json({
        success: false,
        errors: { confPass: "Both passwords must be equal" },
      });
    }

    user.password = newPassword;
    user.confPass = newPassword;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
  }
};

// Function to send user to the home page
const post_homePage = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

//Function to add new task
const post_addTask = async (req, res, next) => {
  const { content } = req.body;

  const result = validationResult(req);
  const errors = {};

  if (!result.isEmpty()) {
    result.array().map((error) => {
      errors[error.path] = error.msg;
    });
    return res.status(400).json({ success: false, errors });
  }

  try {
    const task = await Task.create({ content, userId: req.user._id });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// Function to get all user tasks
const post_userTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

// Function to update task
const put_task = async (req, res, next) => {
  const { newContent } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(id, { content: newContent });

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// Function to delete task
const delete_task = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

//Function to refresh token
const post_refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    jwt.verify(token, process.env.REFRESH_SECRET, async (err, decodeURI) => {
      if (err) {
        return res.status(401).json({ success: false });
      } else {
        const accessToken = createAccessToken(decodeURI.id);
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
        });
        res.status(200).json({ success: true });
      }
    });
  } else {
    res.status(401).json({ success: false });
  }
};

// Function to logout user
const post_logout = (req, res) => {
  res.cookie("accessToken", "", { maxAge: 1 });
  res.cookie("refreshToken", "", { maxAge: 1 });

  res.status(200).json({ success: true });
};

module.exports = {
  post_signup,
  post_login,
  post_forgotPassword,
  post_resetPassword,
  post_verify,
  post_homePage,
  post_addTask,
  post_userTasks,
  put_task,
  delete_task,
  post_refresh,
  post_logout,
};
