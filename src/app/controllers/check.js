const mongoose = require("mongoose");
const Check = require("../models/check");
const agenda = require("../helper/agenda");
const CheckAudit = require("../models/checkAudit");
const Validator = require("../utils/validator/check");
const Email = require("../services/email");
const Constants = require("../config/constants");
/**
 * @desc    Get all checks
 * @route   GET /api/v1/check
 * @access  Private
 */
module.exports.getAll = async (req, res) => {
  const allCkecks = await Check.find({
    ownerId: mongoose.Types.ObjectId(req.user._id),
  }).select("_id name isPaused url path ");
  res.status(200).json({
    allCkecks,
  });
};

/**
 * @desc    Get one check
 * @route   GET /api/v1/check/:checkId
 * @access  Private
 */
module.exports.getOne = async (req, res) => {
  const checkData = await Check.findOne({
    _id: mongoose.Types.ObjectId(req.params.checkId),
  });
  if (!checkData)
    return res
      .status(400)
      .json({ message: "No valid entry found for provided ID" });
  reportData = await createReport(req.params.checkId);
  const history = await CheckAudit.find({
    checkId: mongoose.Types.ObjectId(req.params.checkId),
  }).select("urlState message statusCode responseTime url createdAt");
  res.status(200).json({
    reportData: { status: checkData.isPaused ? "DOWN" : "UP", ...reportData },
    history,
  });
};

/**
 * @desc    Create new check
 * @route   POST /api/v1/check
 * @access  Private
 */

module.exports.create = async (req, res) => {
  const { error } = Validator.create(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  req.body.ownerId = req.user._id;
  const check = new Check(req.body);
  const checkData = await check.save();

  await agenda.create(checkData);
  await Email.sendMail(
    Constants.notificationCheckState.emailSubject,
    Constants.notificationCheckState.emailContent +
      " [\n " +"name: " + checkData.name + ",\n url:" + checkData.url + " ,\n state: " + "UP \n" + "]",
    req.user.email
  );
  res.status(201).json({
    message: "Success create",
  });
};

/**
 * @desc    Get all checks
 * @route   PATCH /api/v1/check/:checkId
 * @access  Private
 */
module.exports.update = async (req, res) => {
  const { error } = Validator.update(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const check = await Check.findOne({
    _id: mongoose.Types.ObjectId(req.params.checkId),
  });
  if (!check)
    return res.status(400).json({
      message: "No valid entry found for provided ID",
    });
  req.body.isPaused = req.body.pause;
  await Check.updateOne(
    { _id: mongoose.Types.ObjectId(req.params.checkId) },
    req.body
  );
  const newCheckData = await Check.findOne({
    _id: mongoose.Types.ObjectId(req.params.checkId),
  });
  if (newCheckData.isPaused) {
    await agenda.canaleJop(newCheckData._id);
    await Email.sendMail(
      Constants.notificationCheckState.emailSubject,
      Constants.notificationCheckState.emailContent +
        " [\n " +"name: " + newCheckData.name + ",\n url:" + newCheckData.url + " ,\n state: " + "DOWN \n" + "]",
      req.user.email
    );
  } else {
    await agenda.create(newCheckData);
    await Email.sendMail(
      Constants.notificationCheckState.emailSubject,
      Constants.notificationCheckState.emailContent +
        " [\n " +"name: " + newCheckData.name + ",\n url:" + newCheckData.url + " ,\n state: " + "UP \n" + "]",
      req.user.email
    );
  }
  res.status(200).json({
    message: "Success update",
  });
};

/**
 * @desc    Create report
 */

const createReport = async (checkId) => {
  let reportData = {};

  const checkHistory = await CheckAudit.find({
    checkId: mongoose.Types.ObjectId(checkId),
  });

  const totalNumberOfRequests = checkHistory.length;
  let numberOfUrlUp = 0,
    numberOfUrlDown = 0,
    downTime = 0,
    upTime = 0,
    totalResponeTimeForUp = 0;

  checkHistory.map((request) => {
    if (request.urlState === "UP") {
      numberOfUrlUp++;
      upTime += request.interval;
    } else {
      numberOfUrlDown++;
      downTime += request.interval;
    }
    totalResponeTimeForUp += request.responseTime;
  });

  reportData.availability =
    ((numberOfUrlUp / totalNumberOfRequests).toFixed(2) * 100).toString() + "%";
  reportData.outages = numberOfUrlDown;
  reportData.downTime = downTime * 60;
  reportData.upTime = upTime * 60;
  reportData.responseTime = parseInt(
    totalResponeTimeForUp / totalNumberOfRequests
  );
  return reportData;
};
module.exports.createReport =createReport; //just for test