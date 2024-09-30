const {UserIndex, AddressModel, UserEmployment, SchedulerJob } = require("../../../db").models;

const User = require("../../../helpers/User");

const { getSettingValue } = require("../../../services/SettingService");

const SETTING = require("../../../helpers/Setting");

const ShiftStatus = require("../../../helpers/ShiftStatus");

// Lib
const Request = require("../../../lib/request");

const MailService = require("../../../services/MailService");

const DateTime = require("../../../lib/dateTime");
const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const errors = require('restify-errors');
const { Op } = require("sequelize");
const String = require("../../../lib/string");
const Number = require("../../../lib/Number");


module.exports = async function (req, res, next) {

    let companyId = Request.GetCompanyId(req);
    let id = req.query.id;


    const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

    let toMail = schedularData?.to_email

    let defaultFromEmail = await getSettingValue(SETTING.FROM_EMAIL, companyId);

    res.send(200, { message: "User InComplete Profile Email Notification Job Started" });

    let params = { companyId: companyId, id: id };

    History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

    res.on("finish", async () => {
        try {

            await schedulerJobCompanyService.setStatusStarted(params, (err) => {
                if (err) {
                    throw new err();
                }
            });


            let updateduserList = new Array();

            let userList = await UserIndex.findAll({
                where: { 
                    status: User.STATUS_ACTIVE, 
                    company_id: companyId,
                },
                order: [['first_name', 'ASC']],
                attributes: ['user_id', 'first_name', 'last_name', 'media_url', 'mobile_number1'] 
            });
            

            for (let i = 0; i < userList.length; i++) {
                let user = userList[i];
                let updatedUser = {
                    id: user.user_id,
                    name: String.concatName(user.first_name, user.last_name),
                    media_url: user.media_url,
                };
            
                let userEmploymentDetails = await UserEmployment.findOne({
                    where: { company_id: companyId, user_id: user && user.user_id },
                    attributes: ['id', 'salary', 'start_date']
                })
                let addressDetails = await AddressModel.findOne({
                    where: { company_id: companyId, object_id: user && user.user_id, object_name: ObjectName.USER },
                    attributes: ['id', 'latitude', 'longitude', 'address1']
                })
            
                if (Number.isNull(userEmploymentDetails && userEmploymentDetails?.start_date)) updatedUser.date_of_joining = 'Date of Joining';
                if (Number.isNull(user.media_url)) updatedUser.userProfile = "User Profile"
                if (Number.isNull(user.mobile_number1)) updatedUser.mobile_number1 = 'Mobile Number';
                if (Number.isNull(userEmploymentDetails && userEmploymentDetails?.salary)) updatedUser.salary = 'Salary';
                if (Number.isNull(addressDetails && addressDetails?.address1)) updatedUser.address = 'Address';
                if (Number.isNull(addressDetails?.latitude) && Number.isNull(addressDetails?.longitude)) {
                    updatedUser.geo_location = 'Geo Location';
                }
            
                if (updatedUser.date_of_joining || updatedUser.userProfile || updatedUser.mobile_number1 || updatedUser.salary || updatedUser.address || updatedUser.geo_location) {
                    updateduserList.push(updatedUser);
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

                let substitutions = {
                    userData: updateduserList,
                }

                for (let i = 0; i < toMail.length; i++) {
                    let sentData = {
                        toEmail: toMail[i],
                        fromEmail: defaultFromEmail,
                        subject: "User InComplete Profile Email Notification",
                        template: "userIncompleteProfileReportEmail",
                        substitutions: substitutions
                    }

                    MailService.sendMail(params, sentData, () => {

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
