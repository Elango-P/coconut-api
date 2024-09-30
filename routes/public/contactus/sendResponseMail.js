const resumeEmail = require("../../../lib/resumeEmail");

//  Config
const config = require("../../../lib/config");

function sendResponseMail(contactUs, callback) {

	const data = {
		from: {
			email: `${config.defaultEmail}`,
			name: "RecruitmentTeam ThiDiff"
		},
		to: contactUs.email,
		subject: "Thank you for your interest",
		template: "contact-us-response",
		substitutions: {
			fullName: contactUs.fullName
		}
	};

	resumeEmail(data, () => callback());
}

module.exports = sendResponseMail;
