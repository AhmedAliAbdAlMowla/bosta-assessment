"use strict"
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Email = require("../services/email");
const Constants = require("../config/constants");
const Validator = require("../utils/validator/user");

/**
 * @desc    Send Confirmation Email Function
 * @access  Just in User Controller
 */
const sendConfirmationEmailFunc = async (email) => {
  const token = await JWT.sign({ email }, process.env.JWT_EMAIL_SECRET, {
    expiresIn: "20min", // 20 minutes
  });
  //  Send mail
  await Email.sendMail(
    Constants.notificationConfirmAccountEmail.emailSubject,
    Constants.notificationConfirmAccountEmail.emailContent + token,
    email
  );
};

/**
 * @desc    Login user
 * @route   POST /api/v1/user/login
 * @access  Public
 */
exports.login = async (req, res) => {
  const { error } = Validator.loginValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(403).json({ message: "Invalid email or account not exist." });
    if (!user.confirmed)
      return res.status(401).json({ message: "Account not confirmed." });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).json({ message: "Invalid  password." });

  const token = await user.generateAuthToken();
  res.status(200).json({ message: "Success Auth", token: token });
};

/**
 * @desc    Signup user
 * @route   POST /api/v1/user/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  const { error } = Validator.signupValidator(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });

  if (user) return res.status(409).json({ message: "User already exists." });

  await User.create(req.body);

  await sendConfirmationEmailFunc(req.body.email);

  res.status(201).json({ messgae: "Success registration" });
};

/**
 * @desc    Resend Confirmation Email
 * @route   POST /api/v1/user/resend/confirmation/email
 * @access  Public
 */
exports.reSendConfirmationEmail = async (req, res) => {
  const { error } = Validator.emailValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
      return res.status(403).json({ message: "Invalid email or  dont have account." });
  if (user.confirmed)
      return res.status(409).json({ message: "Account already confirmed." });

  await sendConfirmationEmailFunc(req.body.email);
  res.status(200).json({ message: "Confirmation email sended." });
};

/**
 * @desc    Confirmation account
 * @route   GET /api/v1/user/confirmation/:token
 * @access  Public
 */

exports.confirmation = async (req, res) => {
  let decoded;
  try {
    decoded = await JWT.verify(req.params.token, process.env.JWT_EMAIL_SECRET);
  } catch (err) {
    return res.status(403).json({ message: "Url is expired" });
  }
  await User.updateOne({ email: decoded.email }, { confirmed: true });

  res.status(200).json({ messgae: "Success confirmation" });
};
