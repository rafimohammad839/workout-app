const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.statics.signup = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    throw Error("Invalid email address");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough!");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await this.create({ email, password: hash });

  return newUser;

}

userSchema.statics.login = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error("All fields are required");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw Error("Incorrect password")
  }

  return user;

}

module.exports = mongoose.model("user", userSchema);