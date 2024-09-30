const config = require("./config");
const sendgrid = require("sendgrid")(config.sendGridAPIKey);
const mailHelper = require("sendgrid").mail;

function mailContent(toEmail, subject, html, callback) {
	if (!html) {
		return callback();
	}

	const personalization = new mailHelper.Personalization();
	toEmail = new mailHelper.Email(toEmail);
	personalization.addTo(toEmail);

	const fromEmail = new mailHelper.Email(config.defaultFromEmail);

	const content = new mailHelper.Content("text/html", html);

	const mailDetail = new mailHelper.Mail();
	mailDetail.setSubject(subject);
	mailDetail.setFrom(fromEmail);
	mailDetail.addPersonalization(personalization);
	mailDetail.addContent(content);

	const request = sendgrid.emptyRequest({
		method: "POST",
		path: "/v3/mail/send",
		body: mailDetail.toJSON()
	});

	const sendgridApi = sendgrid.API(request, (err) => {
		if (err) {
			console.log(err);
		}

		return callback();
	});

	return sendgridApi;
};

module.exports = mailContent;
