// Model
const { candidate, CandidateMessage } = require("../../db").models;

// Get Config
const config = require("../../lib/config");

// Utils
const utils = require("../../lib/utils");

// Mail
const mail = require("../../lib/mail");


function sendEmailToCandidate(candidateIds, message, status) {
    candidate.findOne({
        attributes: ["id", "status", "email", "first_name", "token"],
        where: { id: candidateIds },
    }).then((candidate) => {
        const fromEmail = config.jobsEmail;
        const toEmail = candidate.email;

        if (message) {
            message = utils.rawURLEncode(message);
        }

        // Create Candidate Message
        CandidateMessage.create({
            from_email: fromEmail,
            to_email: toEmail,
            candidate_id: candidate.id,
            message,
        }).then((candidateMessage) => {
            candidateMessage.firstName = candidate.first_name;

            // Update Replied Status
            candidate.update(
                {
                    status: status,
                },
                { where: { id: candidate.id } }
            )
                .then(() => {
                    candidateMessage.token = candidate.token;

                    const data = {
                        to: candidateMessage.to_email,
                        fromName: candidateMessage.firstName,
                        from: candidateMessage.from_email,
                        subject: "Response from ThiDiff",
                        template: "candidate-message-response",
                        substitutions: {
                            message: utils.rawURLDecode(
                                candidateMessage.message
                            ),
                            token: candidateMessage.token,
                        },
                    };

                    // Send Email
                    mail(data, () => {});
                })
                .catch((err) => {
                    req.log.error(err);
                    next(err);
                });
        });
    });
}

function bulkReply(req, res, next) {
    const data = req.body;
    const status = data.status;
    const message = data.message;

    Object.keys(data.ids).forEach(function (key, value) {
        sendEmailToCandidate(data.ids[value], message, status);
    });
    res.send({
        message: "Candidate Profile bulk updated",
    });
}

module.exports = bulkReply;
