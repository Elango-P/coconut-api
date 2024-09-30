const resumeEmail = require("../../lib/resumeEmail");
const config = require("../../lib/config");

const { CandidateProfile } = require("../../db").models;

const sendGridService = require("../../lib/mail");


function sendResponseMail(candidateProfile, callback) {

	CandidateProfile
		.findOne({ attributes: ["first_name", "last_name", "email", "token"], where: { id: candidateProfile.id } })
		.then((candidate) => {
			const data = {
				from: `${config.jobsEmail}`,
				to: candidate.email,
				subject: "Thank you for your interest",
				template: "post-resume-response",
				substitutions: {
					fullName: `${candidate.first_name} ${candidate.last_name}`,
					token: candidate.token
				}
			};

             sendGridService.sendEmail(data, config.sendGridAPIKey, err => {
				callback()
			})
		});
}

module.exports = sendResponseMail;
