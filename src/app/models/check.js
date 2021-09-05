const mongoose = require("mongoose");


/**
 * @desc     Genirate reset code and save code in user document
 */
const checkSchema = new mongoose.Schema({
  ownerId:{ type: mongoose.Types.ObjectId, index: true, required: true },
  name: String,
  url: String,
  protocol: { type: String, enum: ["HTTP", "HTTPS"], default: "HTTPS" },
  path: { type:String},
  port: { type: Number, default: null },
  webhook: {type: String,},
  interval: { type: Number, default: 10 }, // interval between two pings
  timeout: { type: Number, default: 5000 }, // time under which a ping is considered responsive
  threshold: { type: Number, default: 1 }, // nb of errors from which to trigger a new CheckEvent
  errorCount: { type: Number, default: 0 }, // count number of errors
  
    authUserName:{type: String,},
    authPassword:{type: String,},
  assertStatusCode: { type:String},
  tags: [String],
  isPaused: { type: Boolean, default: false },
 
});

module.exports = mongoose.model("Check", checkSchema);
