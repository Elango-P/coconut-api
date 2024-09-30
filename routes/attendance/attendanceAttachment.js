
/**
 * Module dependencies
 */
// Status
const { BAD_REQUEST, CREATE_SUCCESS } = require("../../helpers/Response");
const Permission = require("../../helpers/Permission");
// Models
const { Attendance: AttendanceModal } = require("../../db").models;
const History = require("../../services/HistoryService");
// Lib
const Request = require("../../lib/request");

const ObjectName = require("../../helpers/ObjectName");

const MediaService = require("../../services/MediaService");

const AttendanceService = require("../../services/AttendanceService");

const { Media } = require("../../helpers/Media");

const WhatsappService = require("../../services/WhatsAppService");
const { getSettingValue } = require("../../services/SettingService");
const Setting = require("../../helpers/Setting");
const Attendance = require("../../helpers/Attendance");

async function attendanceAttachment(req, res, next) {
  try {
   
    let data = req.body;

    const uploadFileData = req && req.files && req.files.media_file;

    const { attendanceId, activityType } = data;

    if (!data.attendanceId) {
      return res.json(400, { message: "Attendance Id Is Required" });
    }

    if (!uploadFileData) {
      return res.json(400, { message: "Media Is Required" });
    }

    const companyId = Request.GetCompanyId(req);

    // Create Order product
    res.json(CREATE_SUCCESS, {
      message: `${activityType}  Added`,
    });

    res.on("finish", async () => {

      let attendanceDetail = await AttendanceModal.findOne({
        where: { company_id: companyId, id: attendanceId }
      })
  
      if (attendanceDetail) {

        data.object_id = attendanceDetail.id;

        data.media_visibility = Media.VISIBILITY_PUBLIC;

        data.object = ObjectName.ATTENDANCE;

        data.feature = Media.FEATURE_ENABLED;

        let mediaDetails = await MediaService.create(data, uploadFileData, companyId);
         let created_at=attendanceDetail?.created_at
         let updated_at=attendanceDetail?.updated_at
        if (mediaDetails) {

          if (activityType == "Check In") {
            attendanceDetail.update({ check_in_media_id: mediaDetails.id });
          } else if (activityType == "Check Out") {
            attendanceDetail.update({ check_out_media_id: mediaDetails.id });
          }
          let channelId = await getSettingValue(Setting.ATTENDANCE_NOTIFICATION_CHANNEL, companyId);
          if(channelId && channelId !==""){
            AttendanceService.SendMessge(mediaDetails.id, attendanceDetail.id, companyId, activityType,created_at, updated_at,channelId);
          }
          if (attendanceDetail && attendanceDetail.type=== Attendance.TYPE_ADDITIONAL_DAY && activityType !== "Check Out") {
            let channelId = await getSettingValue(Setting.ATTENDANCE_ADDITIONAL_DAY_NOTIFICATION_CHANNEL, companyId);
            if(channelId && channelId !==""){
              AttendanceService.SendMessge(mediaDetails.id, attendanceDetail?.id, companyId, attendanceDetail.type, attendanceDetail?.created_at, null, channelId);
            }
          }

          let mediaUrl = await MediaService.getMediaURL(mediaDetails.id, companyId);

          if (mediaUrl) {
            WhatsappService.sendAttendanceImage(mediaUrl, companyId);
          }
        }
      }

      //create system log for product updation
      History.create(`${activityType} Media Added`, req,
        ObjectName.ATTENDANCE, attendanceId
      );

    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}

module.exports = attendanceAttachment;