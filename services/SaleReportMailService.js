
//Email
const mailService = require("./MailService");

//Service
const DataBaseService = require("../lib/dataBaseService");
const History = require("../services/HistoryService");
const Request = require("../lib/request");
const { searchStore } = require("./LocationService");
const SalesSettlementReport= require("../helpers/SalesSettlementReport");
const schedulerJobCompanyService = require("../routes/scheduler/schedularEndAt");
const Location = require("../helpers/Location");
const DateTime = require("../lib/dateTime");
const Currency = require("../lib/currency");




class SaleEmailService extends DataBaseService {
    async sendMail(params, fromMail, toMail, companyId, callback) {

        try {
            const{companyId}=params

            
            let param={
                allowSale:Location.ENABLED,
                status:Location.STATUS_ACTIVE,
                currentDate : params.currentDate
            }

            let data = await searchStore(param, companyId);
            let totalAmount=0

            for(let i=0;i<data.data.length;i++){
                totalAmount += Number(data.data[i].total_amount) 
            }

            // Email Substitution
            const emailSubstitutions = {
                saleData: data.data,
                date:DateTime.Format(params.currentDate),
                totalAmount: Currency.IndianFormat(totalAmount)
            };

            // Email Data
            const emailData = {
                fromEmail: fromMail,
                toEmail: toMail,
                template: "saleReport",
                subject: `Daily Sales Report - ${DateTime.Format(params.currentDate)}`,
                substitutions: emailSubstitutions,
            };

            // Sent Email
            mailService.sendMail(params, emailData,  async err => {
                if (err) {
                    console.log(err);
                }
 
                return callback();
            });
        } catch (error) {
            console.log(err);
            throw error;
        }
    }
}

const saleEmailService = new SaleEmailService();

module.exports = saleEmailService;

