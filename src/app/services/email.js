"use strict"
let transporter = require("../config/email");

/**
 * @desc      Send email 
 * @param     subject, text, to
 */
exports.sendMail = async (subject, text, to) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    subject,
    text,
    to,
  };

  await transporter.sendMail(mailOptions);
};
