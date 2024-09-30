const resumeEmail = require("../../lib/resumeEmail");
const config = require("../../lib/config");

function sendApplyLeaveEmail(details, callback) {
	const data = {
		from: {
			email: details.email,
			name: details.name
		},
		to: `${config.defaultLeaveEmail}`,
		subject: `Requesting Leave on ${details.date}`,
		template: "apply-leave-email",
		substitutions: {
			message: details.message,
			name: details.name,
			lastName: details.last_name,
			date: details.date,
		}
	};

	resumeEmail(data, () => callback());
}

module.exports = sendApplyLeaveEmail;
