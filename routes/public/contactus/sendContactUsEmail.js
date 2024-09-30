const resumeEmail = require("../../../lib/resumeEmail");

// Config
const config = require("../../../lib/config");

function sendContactUsEmail(contactUs, callback) {
	const data = {
		from: {
			email: contactUs.email,
			name: contactUs.fullName
		},
		to: `${config.defaultEmail}`,
		subject: `${contactUs.subject}`,
		template: "contact-us-email",
		substitutions: {
			fullName: contactUs.fullName,
			phone: contactUs.phone,
			email: contactUs.email,
			subject: contactUs.subject,
			message: contactUs.message
		}
	};

	resumeEmail(data, () => callback());
}

module.exports = sendContactUsEmail;
