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
const salesSettlementMisssingReportService  = require("../../../services/salesSettlementMisssingReportService");
const Response = require("../../../helpers/Response");
const CompanyService = require("../../../services/CompanyService");
const DateTime = require("../../../lib/dateTime");

module.exports = async function (req, res) {

    let params = { companyId: Request.GetCompanyId(req), id: Request.GetId(req) };

    let defaultFromEmail = await getSettingValue(SETTING.FROM_EMAIL, Request.GetCompanyId(req));
    let companyDetail = await CompanyService.getCompanyDetailById(Request.GetCompanyId(req));
    let defaultTimeZone = Request.getTimeZone(req);

    const schedularData = await SchedulerJobService.findOne({ where: { id: Request.GetId(req), company_id: Request.GetCompanyId(req) } });

    res.send(Response.OK, { message: `Job Started` });

    res.on("finish", async () => {
        try {

            History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, Request.GetId(req));
            await schedulerJobCompanyService.setStatusStarted(params, err => {
                if (err) {
                    throw new err();
                }
            });

            let updatedSaleList = await salesSettlementMisssingReportService.list(Request.GetCompanyId(req))

            let toEmail = schedularData?.to_email
            if (!toEmail) {
                throw new errors.NotFoundError('To Mail Not Found');
            } else {
                toEmail = toEmail.split(",");
            }

            if (!defaultFromEmail) {
                res.send(Response.BAD_REQUEST, { message: "Default From Email Required" });
            }

            if (toEmail && toEmail.length > 0 && toEmail !== null) {

                let substitutions = {
                    saleData: updatedSaleList,
                    schedularName: schedularData?.name,
                    companyLogo: companyDetail && companyDetail?.company_logo,
                    companyName: companyDetail && companyDetail?.company_name,
                    reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(), defaultTimeZone),
                    saleDataCount: updatedSaleList && updatedSaleList.length
                }
                for (let i = 0; i < toEmail.length; i++) {
                    let sentData = {
                        toEmail: toEmail[i],
                        fromEmail: defaultFromEmail,
                        subject: "Sales Settlement Missing Report",
                        template: "salesSettlementMisssingReport",
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
