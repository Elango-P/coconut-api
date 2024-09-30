const async = require("async");
const { Candidate } = require("../../db").models;
const { CandidateMessage } = require("../../db").models;
const config = require("../../lib/config");
const resumeEmail = require("../../lib/resumeEmail");

function sendBulkMessage(id, replyMessage, callback) {
	if (!id) {
		return callback();
	}

	Candidate
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
});
});
}

function bulkMessage(req, res) {
	const ids = req.body.candidateId.split(",");
	const replyMessage = req.body.replyMessage;
	async
.eachSeries(ids, (id, cb) => sendBulkMessage(id, replyMessage, () => cb()), () => {
	res.json({ message: "Submitted" });
});
};

module.exports = bulkMessage;
