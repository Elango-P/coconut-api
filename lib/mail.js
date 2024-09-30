const sendgrid = require("sendgrid");
const emailTemplates = require('email-templates')
const DataBaseService = require("../lib/dataBaseService");
const EmailTemplate = emailTemplates.EmailTemplate;
const validator = require("../lib/validator");
const mailHelper = require("sendgrid").mail;
class SendGridService extends DataBaseService {
    async sendEmail(data, apiKey, callback) {
        const {
            from,
            to,
            template,
            subject,
            substitutions,
            attachment,
            fileName,
        } = data;

        const sendgridAPI = sendgrid(apiKey);

        // Validate if from email is null
        if (!from) {
            return callback(new Error("From email is required"));
        }

        const toEmails = typeof to === "string" ? to.split(',') : to;

        // Validate if toEmail is found or not
        if (!toEmails) {
            return callback();
        }

        // Validate if to email length is 0
        if (toEmails && toEmails.length === 0) {
            return callback(new Error("To email is required"));
        }

        // Email templates
        const emailTemplate = new EmailTemplate(`${process.cwd()}/emailTemplate/${template}`);


        // Render email templates
        emailTemplate.render(substitutions, (err, results) => {

            if (err) {
                return callback(err);
            }

            const content = new mailHelper.Content("text/html", results.html);
            const personalization = new mailHelper.Personalization();

            toEmails.forEach(toEmail => {
                toEmail = new mailHelper.Email(toEmail);

                personalization.addTo(toEmail);
            });

            const mailDetail = new mailHelper.Mail(to);

            mailDetail.addPersonalization(personalization);
            mailDetail.setSubject(subject);

            if (typeof from === "string") {
                mailDetail.setFrom(new mailHelper.Email(from));
            } else {
                mailDetail.setFrom(from);
            }


            // Attachment data
           if (attachment && fileName) {
                let isbase64 = validator.isBase64(attachment);
                
                let attachmentBase64;
                if (!isbase64) {
                    let objJsonB64 = Buffer.from(attachment).toString(
                        "base64"
                    );
                    attachmentBase64 = objJsonB64;
                } else {
                    attachmentBase64 = attachment;
                }

                const attachmentHelper = new mailHelper.Attachment();
                attachmentHelper.setContent(attachmentBase64);
                attachmentHelper.setFilename(fileName);
                attachmentHelper.setDisposition("attachment");
                mailDetail.addAttachment(attachmentHelper);
            }

            mailDetail.addContent(content);

            const request = sendgridAPI.emptyRequest({
                method: "POST",
                path: "/v3/mail/send",
                body: mailDetail.toJSON(),
            });

            // Call send API to send an email
            sendgridAPI.API(request, err => {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
        });
    }
}
const sendGridService = new SendGridService();

module.exports = sendGridService;
