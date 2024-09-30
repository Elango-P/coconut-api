const { CandidateProfile } = require("../../db").models;
const { CandidateMessage } = require("../../db").models;
const config = require("../../lib/config");
const resumeEmail = require("../../lib/resumeEmail");


function message(req, res, callback) {
	const data = req.body;
	const id = data.candidateId;
	const replyMessage = data.replyMessage;

	CandidateProfile
		.findOne({
			attributes: ["email"],
			where: { id }
		})
		.then((candidateDetails) => {
			CandidateMessage.create({
				candidate_id: id,
				message: replyMessage,
				from_email: `${config.jobsEmail}`,
				to_email: candidateDetails.email
			})
				.then(() => {
					const candidateMessageEmailData = {
						from: {
							email: `${config.jobsEmail}`,
							name: "RecruitmentTeam ThiDiff"
						},
						to: candidateDetails.email,
						subject: "Thank you for your interest",
						template: "post-resume-response",
						substitutions: {
							replyMessage
						}
					};
					resumeEmail(candidateMessageEmailData, () => callback());
					res.json(200, {
						message: "Submitted"
					});
				});
		});
}

module.exports = message;
