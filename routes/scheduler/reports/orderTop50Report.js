const { SchedulerJob } = require("../../../db").models;

const { getSettingValue } = require("../../../services/SettingService");

const SETTING = require("../../../helpers/Setting");

// Lib
const Request = require("../../../lib/request");

const MailService = require("../../../services/MailService");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const DataBaseService = require('../../../lib/dataBaseService');
const SchedulerJobService = new DataBaseService(SchedulerJob);
const errors = require("restify-errors");
const OrderTop50ReportService = require("../../../services/OrderTop50ReportService");

module.exports = async function (req, res) {

    let params = { companyId: Request.GetCompanyId(req), id: Request.GetId(req) };

    let timeZone = Request.getTimeZone(req)

    let defaultFromEmail = await getSettingValue(SETTING.FROM_EMAIL, Request.GetCompanyId(req));

    const schedularData = await SchedulerJobService.findOne({ where: { id: Request.GetId(req), company_id: Request.GetCompanyId(req) } });

    res.send(200, { message: `Job Started` });

    res.on("finish", async () => {
        try {

            History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, Request.GetId(req));
            await schedulerJobCompanyService.setStatusStarted(params, err => {
                if (err) {
                    throw new err();
                }
            });

            let orderTop50List = await OrderTop50ReportService.list(timeZone,Request.GetCompanyId(req));

            let toEmail = schedularData?.to_email
            if (!toEmail) {
                throw new errors.NotFoundError('To Mail Not Found');
            } else {
                toEmail = toEmail.split(",");
            }

            if (!defaultFromEmail) {
                res.send(400, { message: "Default From Email Required" });
            }

            if (toEmail && toEmail.length > 0 && toEmail !== null) {

                let substitutions = {
                    data: orderTop50List
                }
                for (let i = 0; i < toEmail.length; i++) {
                    let sentData = {
                        toEmail: toEmail[i],
                        fromEmail: defaultFromEmail,
                        subject: "Order Top(50) Report",
                        template: "orderTop50Report",
                        substitutions: substitutions
                    }
                    MailService.sendMail(params, sentData, () => { });
                }

            }
        } catch (err) {

            console.log(err);
            await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
                if (err) {
                    throw new err();
                }
            });
        }
    })

};
