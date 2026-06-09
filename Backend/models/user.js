const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "This field is required"],
  },
  email: {
    type: String,
    required: [true, "This field is required"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "This field is required"],
    minlength: [6, "Password must be contains at least 6 chars"],
  },
  confPass: {
    type: String,
    required: [true, "This field is required"],
  },
  avatar: {
    type: String,
    default: null,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

//Function to encription password before add user to the database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  //Check if password fields is not equal?
  if (this.password !== this.confPass) {
    throw Error("Both passwords must be equal!");
  }

  // encription password and delete confPass from user
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confPass = undefined;
});

// Login Function
userSchema.statics.login = async (email, password) => {
  const user = await User.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("Password is not correct");
    }
  } else {
    throw Error("User is not found, please signup!");
  }
};

const User = mongoose.model("user", userSchema);

module.exports = User;
