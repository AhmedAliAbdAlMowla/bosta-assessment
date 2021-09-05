const mongoose = require("mongoose");

/**
 * @desc     Genirate reset code and save code in user document
 */
const checkAuditSchema = new mongoose.Schema(
  {
    checkId: { type: mongoose.Types.ObjectId, index: true, required: true },
    urlState: { type: String, enum: ["UP", "DOWN"],index: true },
    url: String,
    message: String,
    statusCode: String,
    responseTime: { type: Number },
    interval: { type: Number, default: 10 }, // interval between two pings
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CheckAudit", checkAuditSchema);
