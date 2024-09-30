const Request = require("../../../lib/request");
const { Attendance: attendanceModel, SchedulerJob, Location, Setting, Media } = require("../../../db").models;
const { Op } = require("sequelize");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const storeNoCheckInNotificationService = require("../../../services/storeNoCheckInNotificationService");
const DateTime = require("../../../lib/dateTime");
const { ACTIVE } = require("../../../helpers/SchedulerJobStatus");
const { getMediaURL } = require("../../../services/MediaService");
const errors = require("restify-errors");

module.exports = async function (req, res, next) {
  const companyId = Request.GetCompanyId(req);

  // send response
  let id = req.query.id;

  const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

  res.send(200, { message: `${schedularData?.name} Job Started` });

  History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);
  res.on("finish", async () => {
    let currentDate = new Date().toISOString().slice(0, 10);

    let toMail = schedularData?.to_email;

    // params
    const params = {
      companyId: companyId,
      id: id,
      name: schedularData?.name,
      toMail: toMail,
      currentDate: currentDate,
    };
    try {
      if (companyId) {
        await schedulerJobCompanyService.setStatusStarted(params, (err) => {
          if (err) {
            throw new err();
          }
        });

        let headerColor = [];
        let headerTextColor = [];

        let mediaData = await Media.findOne({
          where: { company_id: companyId, object_name: ObjectName.PORTAL_LOGO_URL, object_id: companyId },
          order: [["createdAt", "DESC"]],
        });

        let mediaUrl = await getMediaURL(mediaData?.id, companyId);

        const getSettingDetails = await Setting.findAndCountAll({
          where: {
            company_id: companyId,
          },
        });

        for (let i in getSettingDetails.rows) {
          let value = getSettingDetails.rows[i];
          if (value.name === "portal_header_color") {
            headerColor.push(value?.value);
          }
          if (value.name === "portal_header_text_color") {
            headerTextColor.push(value?.value);
          }
        }

        // validate to mail
        if (!schedularData?.to_email) {
          throw new errors.NotFoundError("To Mail Not Found");
        } else {
          toMail = toMail.split(",");
        }
        if (toMail.length > 0 && toMail !== null) {
          storeNoCheckInNotificationService.sendMail(
            params,
            {
              orderDate: DateTime.Format(currentDate),
              logoImage: mediaUrl,
              headerColor: headerColor,
              headerTextColor: headerTextColor,
            },
            () => {}
          );
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
  });
};
