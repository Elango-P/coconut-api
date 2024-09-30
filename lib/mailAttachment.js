const config = require("./config");
const sendgrid = require("sendgrid")(config.sendGridAPIKey);
const mailHelper = require("sendgrid").mail;
const fs = require("fs");
const mime = require("mime-types");

function mailAttachment(toEmail, subject, file, fileName, callback) {
	file = fs.readFileSync(file);
	const base64File = new Buffer(file).toString("base64");

	const attachment = new mailHelper.Attachment();
	attachment.setContent(base64File);
	attachment.setType(mime.lookup(fileName));
	attachment.setFilename(fileName);
	attachment.setDisposition("attachment");

	const personalization = new mailHelper.Personalization();
	toEmail = new mailHelper.Email(toEmail);
	personalization.addTo(toEmail);

	const fromEmail = new mailHelper.Email(config.defaultFromEmail);

	const content = new mailHelper.Content("text/html", "Attached File");

	const mailDetail = new mailHelper.Mail();
	mailDetail.setSubject(subject);
	mailDetail.setFrom(fromEmail);
	mailDetail.addAttachment(attachment);
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

module.exports = mailAttachment;
