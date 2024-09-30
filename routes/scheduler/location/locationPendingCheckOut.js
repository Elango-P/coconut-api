const { SchedulerJob } = require("../../../db").models;
const { getSettingValue } = require("../../../services/SettingService");
const SETTING = require("../../../helpers/Setting");
const Request = require("../../../lib/request");
const DateTime = require("../../../lib/dateTime");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const errors = require('restify-errors');
const LocationService = require("../../../services/LocationService");
const ArrayList = require("../../../lib/ArrayList");
const AttendanceService = require("../../../services/AttendanceService");
const { Op } = require("sequelize");
const { getCompanyDetailById } = require("../../../services/CompanyService");
const mailService = require("../../../services/MailService");
const StoreProduct = require("../../../helpers/StoreProduct");


module.exports = async function (req, res, next) {

    let companyId = Request.GetCompanyId(req);
    let id = req.query.id;


    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });
    let companyDetail = await getCompanyDetailById(companyId);

    let toMail = schedularData?.to_email

    let defaultFromEmail = await getSettingValue(SETTING.FROM_EMAIL, companyId);

    let defaultTimeZone = Request.getTimeZone(req);

    let currentDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(defaultTimeZone));

    res.send(200, { message: "Location Pending Check-Out Job Started" });

    let params = { companyId: companyId, id: id };

    History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

    res.on("finish", async () => {
        try {

            await schedulerJobCompanyService.setStatusStarted(params, (err) => {
                if (err) {
                    throw new err();
                }
            });


            let locationList = await LocationService.list(companyId);
            let locationPendingCheckOut = [];
            if (ArrayList.isArray(locationList)) {
                for (let i = 0; i < locationList.length; i++) {
                    const value = locationList[i];
                    let attendanceList = await AttendanceService.findOne({
                        where: {
                            company_id: companyId,
                            store_id: value?.id,
                            date: {
                                [Op.and]: {
                                    [Op.gte]: currentDate,
                                    [Op.lte]: currentDate,
                                },
                            },
                            login: { [Op.ne]: null }, logout: null
                        }
                    })
                    if (attendanceList) {
                        locationPendingCheckOut.push({
                            locationName: value?.name
                        })
                    }

                }
            }

            if (!toMail) {
                throw new errors.NotFoundError('To Mail Not Found');
            } else {
                toMail = toMail.split(",");
            }

            if (!defaultFromEmail) {
                throw new errors.NotFoundError('defaultFromEmail Mail Not Found');
            }

            if (toMail && toMail.length > 0 && toMail !== null) {

                if (locationPendingCheckOut && locationPendingCheckOut.length > 0) {

                    const emailSubstitutions = {
                        locationPendingCheckOut: locationPendingCheckOut,
                        count: locationPendingCheckOut && locationPendingCheckOut.length,
                        companyName: companyDetail && companyDetail?.company_name,
                        reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(), defaultTimeZone),
                        schedularName: schedularData && schedularData?.name,
                        companyLogo: companyDetail && companyDetail?.company_logo,
                    };

                    // Email Data
                    const emailData = {
                        fromEmail: defaultFromEmail,
                        toEmail: toMail,
                        template: 'locationPendingCheckOutReportEmail',
                        subject: `Location Pending Check-Out Report - ${emailSubstitutions.reportGeneratedAt}`,
                        substitutions: emailSubstitutions,
                    };

                    // Sent Email
                    mailService.sendMail(params, emailData, async (err) => {
                        if (err) {
                            History.create(StoreProduct.EMAIL_SENT_FAILED);
                            console.log(err);
                        }
                    });

                }

            }
        } catch (err) {
            console.log(err);
            // Set Scheduler Status Completed
            await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
                if (err) {
                    throw new err();
                }
            });
        }
    })


};
