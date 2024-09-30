// Mail
const mail = require("../../lib/mail");

// Utils
const utils = require("../../lib/utils");

function sendResponseMail(candidateMessage, callback) {
  if (!candidateMessage.message) {
    return callback();
  }

  // Email Data
  const data = {
    to: candidateMessage.to_email,
    fromName: candidateMessage.firstName,
    from: "qa+vishnu@thidiff.com",
    subject: "Response from ThiDiff",
    template: "candidate-message-response",
    substitutions: {
      message: utils.rawURLDecode(candidateMessage.message),
      token: candidateMessage.token,
    },
  };
  // Send Email
  mail(data, () => callback());
}

module.exports = sendResponseMail;
