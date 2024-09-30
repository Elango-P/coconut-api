// Email
const mailService = require("./MailService");
const { SchedulerJob } = require('../db').models;

// Service
const DataBaseService = require("../lib/dataBaseService");
const History = require("./HistoryService");
const Request = require("../lib/request");
const schedulerJobCompanyService = require("../routes/scheduler/schedularEndAt");
const {getSettingValue} = require("./SettingService");
const MailConstants = require("../helpers/Setting");
const {BAD_REQUEST} = require("../helpers/Response");
const StoreProduct = require("../helpers/StoreProduct");
const errors = require("restify-errors");
const SchedulerJobService = new DataBaseService(SchedulerJob);


class StoreProductQuantityEmailService extends DataBaseService {
    async sendMail(params, data, callback) {
       const{companyId, id,toMail} = params

        try {
            const fromMail = await getSettingValue(MailConstants.FROM_EMAIL, companyId);

            if (!fromMail) {
                throw new errors.NotFoundError('From Mail Not Found');
              }

                // Email Substitution
                const emailSubstitutions = {
                    sendData: data.storeProductData
                };


                // Email Data
                const emailData = {
                    fromEmail: fromMail,
                    toEmail: toMail,
                    template: "storeShortageProductNotification",
                    subject: "Store Product Quantity Report",
                    substitutions: emailSubstitutions
                };


                // Sent Email
                mailService.sendMail(params, emailData, async err => {
                    if (err) {
                        // System Log
                        History.create(StoreProduct.EMAIL_SENT_FAILED);
                        console.log(err);
                    } 
                    return callback();
                });

        } catch (error) {
            // Create System Log for Failed
            console.log(error);
            throw error;
        }
    }
}

const storeProductQuantityEmailService = new StoreProductQuantityEmailService();

module.exports = storeProductQuantityEmailService;
