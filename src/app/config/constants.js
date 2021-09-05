"use strict";
exports.notificationDoneTask = "has been completed please log in to your account for more details.";

exports.notificationConfirmAccountEmail={

    emailSubject:"(BOSTA) Account Confirmation Email",
    emailContent :"To confirm your account, go to this link:"+process.env.confirmUrlBase+"api/v1/user/confirmation/"
   
}