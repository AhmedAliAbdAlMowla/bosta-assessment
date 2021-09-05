const axios = require("axios");
const mongoose = require("mongoose");
const Check = require("../models/check");
const Email = require("../services/email");
const User = require("../models/user");
const Constants = require("../config/constants");

let handelDown = async (agenda, id, check) => {
  const ckeckData = await Check.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(id) },
    { $inc: { errorCount: 1 } }
  ).select("errorCount -_id");

  if (ckeckData.errorCount + 1 === check.threshold) {
    console.log(check.name+" #### down");
    await Check.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      { isPaused: true, errorCount: 0 }
    );
    await agenda.cancel({ name: id.toString() });
    //  Send mail
    const userEmail = await User.findOne(
      { _id: mongoose.Types.ObjectId(check.ownerId) }
    ).select("email");

    /**
     * 
     * here you can sendd down data to any WEBHOOK as services like email
     */

  await Email.sendMail(
    Constants.notificationCheckState.emailSubject,
    Constants.notificationCheckState.emailContent +" [\n "+"name: "+check.name+",\n url:"+check.url+ " ,\n state: "+"DOWN \n"+"]",
    userEmail
  );
  }
};

module.exports.test = async (agenda, id, url, check) => {
  const auth={};
  auth.username=check.authUserName;
  auth.password=check.authPassword;
  pingInfo = { urlState:"UP",message: "url up", statusCode: "200", responseTime: check.timeout };
  try {
    console.log(url);
    const startTime = Date.now();
    const result = await axios({
      method: "get",
      url: url,
      timeout: check.timeout,
      auth: auth,
    }
    );
    const endTime = Date.now();

    pingInfo.responseTime = endTime - startTime;

    const statusCode = result.status.toString();
    console.log(check.assertStatusCode)
    pingInfo.statusCode = statusCode;

    if(!check.assertStatusCode){

    
     if (statusCode.match(/5[0-9][0-9]/)) {
          pingInfo.message = "server error ";
          pingInfo.urlState="DOWN";
          await handelDown(agenda, id, check);
    } 
    else if (statusCode.match(/4[0-9][0-9]/)) {
          pingInfo.message = "url not found ";
          pingInfo.urlState="DOWN";
          await handelDown(agenda, id, check);
    }
  }
  else if(check.assertStatusCode!=statusCode){
    pingInfo.message = "url assert error ";
    pingInfo.urlState="DOWN";
    await handelDown(agenda, id, check);
  }
  } catch (err) {
          pingInfo.urlState="DOWN";
          pingInfo.message = "url error";
          pingInfo.statusCode="404";
          await handelDown(agenda, id, check);
  }
  return pingInfo;
};
