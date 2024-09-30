

//Service
const DataBaseService = require("../lib/dataBaseService");
const History = require("../services/HistoryService");
const sendGridService = require("../lib/mail");
const config = require("../lib/config");
const schedulerJobCompanyService = require("../routes/scheduler/schedularEndAt");
const StoreProduct = require("../helpers/StoreProduct");
const Setting = require("../helpers/Setting");
const { Setting:SettingModel } = require("../db").models;

class MailService extends DataBaseService {
    async sendMail(params, data, callBack) {
        try {
            //Email Substitution
            const emailSubstitutions = {
                ...data.substitutions,
            };

            let where = {}

            if(params.companyId) {
                where.company_id = params.companyId
            }
            where.name = Setting.FROM_EMAIL_DISPLAY_NAME

            const settingDetails = await SettingModel.findOne({
                where: where
            });

            //Email data
            const emailData = {
                to: data.toEmail,
                from: {
                    email: data.fromEmail,
                    name: settingDetails?.value ? settingDetails?.value : ""
                },
                subject: data.subject,
                template: data.template,
                substitutions: emailSubstitutions,
                // attachment: data.attachment,
                // fileName: data.fileName,
            };


            return sendGridService.sendEmail(emailData, config.sendGridAPIKey, async (err) => {
                if (err) {
                    // System Log
                    console.log(err);
                }
                if(params && params?.id){

                    await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
                        if (err) {
                            throw  err;
                        }
                    });
                }
                // Set Scheduler Status Completed

                return callBack && callBack();
            });
        } catch (error) {
            console.log(error);
        }
    }
}
const mailService = new MailService();


module.exports = mailService;
