"use strict";

exports.notificationConfirmAccountEmail={

    emailSubject:"(BOSTA) Account Confirmation Email",
    emailContent :"To confirm your account, go to this link:"+process.env.confirmUrlBase+"api/v1/user/confirmation/"
   
}
exports.notificationCheckState={

    emailSubject:"(BOSTA) Your Check State Email",
    emailContent :"your check"
   
}