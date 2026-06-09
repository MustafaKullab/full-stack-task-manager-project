const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const upload = require("../middleware/upload");
const authUser = require("../middleware/authUser");

const {
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
} = require("../controllers/controller");

// Router to add new user
router.post(
  "/signup",
  upload.single("avatar"),
  [
    body("username")
      .notEmpty()
      .withMessage("This field is required")
      .trim()
      .escape(),
    body("email")
      .notEmpty()
      .withMessage("This field is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .toLowerCase()
      .trim()
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("This field is required")
      .isLength({ min: 6 })
      .withMessage("Password must be contains at least 6 chars")
      .trim()
      .escape(),
    body("confPass")
      .notEmpty()
      .withMessage("This field is required")
      .trim()
      .escape(),
  ],
  post_signup
);

//Router to verify the code

// Router to verify the code
router.post("/verify", post_verify);

// Router to login user
router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("This field is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .toLowerCase()
      .trim()
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("This field is required")
      .isLength({ min: 6 })
      .withMessage("Password must be contains at least 6 chars")
      .trim()
      .escape(),
  ],
  post_login
);

// Post forgot password to handle with email to send code
router.post("/forgot-password", post_forgotPassword);

// Post to reset password
router.post(
  "/reset-password",
  [
    body("newPassword")
      .notEmpty()
      .withMessage("This field is required")
      .isLength({ min: 6 })
      .withMessage("New password must be contains at least 6 char")
      .trim()
      .escape(),
  ],
  post_resetPassword
);

//Post to send user to the home page
router.post("/homePage", authUser, post_homePage);

//Post to add new task
router.post(
  "/addTask",
  [
    body("content")
      .notEmpty()
      .withMessage("This field is required")
      .trim()
      .escape(),
  ],
  authUser,
  post_addTask
);

//Router to get all user tasks
router.post("/userTasks", authUser, post_userTasks);

//Router to update task
router.put("/updateTask/:id", put_task);

// Router to delete the task
router.delete("/deleteTask/:id", delete_task);

//Post to refresh token
router.post("/refresh", post_refresh);

// Router to logout user
router.post("/logout", post_logout);

module.exports = router;
