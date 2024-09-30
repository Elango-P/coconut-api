// Models
const { CandidateMessage, CandidateProfile } = require("../../db").models;
const errors = require("restify-errors");

// Config
const config = require("../../lib/config");

// Send Email
const sendReponseMail = require("./sendReponseMail");

function sendReplyMessage(req, res, next) {
  const data = req.body;
  const candidateId = data.candidateId;
  const message = data.message;
  const status = data.status;

  // Validate Candidate Profile
  if (!candidateId) {
    return res.status(400).send({ message: "candidate Profile is required" });
  }

  CandidateProfile.findOne({
    attribute: ["id", "first_name", "token", "status", "email"],
    where: { id: candidateId },
  }).then((candidateProfile) => {
    // Candidate Profile Not Exists
    if (!candidateProfile) {
      return res.status(404).send({ message: "Candidate Profile not found" });
    }

    // Update Status
    candidateProfile.update({ status }).then(() => {
      // Return Success Message
      if (!message) {
        res.json({
          message: "Candidate profile updated",
        });
      }

      // Create Candidate Message
      CandidateMessage.create({
        from_email: config.jobsEmail,
        to_email: candidateProfile.email,
        candidate_id: candidateProfile.id,
        message,
      })
        .then((candidateMessage) => {
          candidateMessage.firstName = candidateProfile.first_name;

          // Send Response Email
          sendReponseMail(candidateMessage, () => {
            res.json({
              message: "Message send",
              candidateMessageId: candidateMessage.id,
            });
          });
        })
        .catch((err) => {
          return next(new errors.BadRequestError(err));
        });
    });
  });
}

module.exports = sendReplyMessage;
