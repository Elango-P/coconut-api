// Slack Notification
const SettingConstants = require("../../helpers/Setting");
const { getSettingValue } = require("../SettingService")
const request = require('request');
const fs = require('fs');
const path = require('path');
const http = require('http');
const SlackService = require("../SlackService");
// const 

module.exports = {

  /**
   * Send Bill Notification
   *
   * @param activityData
   * @param callback
   */
  sendAttendenceAddNotification: async (messageObject, callback) => {
    //validate company Id exist or not
    if (messageObject && !messageObject.companyId) {
      return null;
    }
    //get slack Id from setting
    let slackId = await getSettingValue(SettingConstants.ATTENDENCE_NOTIFICATION_SLACK_CHANNEL, messageObject.companyId);

    //validate slack id exist or not
    if (slackId) {
      if (messageObject.checkIn) {
        const text = unescape(
          `${messageObject.name} Checked In At ${messageObject.locationName}  
  ${messageObject.media_url}`
        );

        return SlackService.sendMessageToChannel(slackId, text, () => { });
      }
      else {
        const text = unescape(
          `${messageObject.name} Checked Out At ${messageObject.locationName}  
  ${messageObject.media_url}`
        );

        return SlackService.sendMessageToChannel(slackId, text, () => { });
      }

    }
  },

  sendNoChekinActivityReport : async (messageObject) => {
    //validate company Id exist or not
    if (messageObject && !messageObject.companyId) {
      return null;
    }
    //get slack Id from setting
    let slackId = await getSettingValue(SettingConstants.ATTENDENCE_NOTIFICATION_SLACK_CHANNEL, messageObject.companyId);

    //validate slack id exist or not
    if (slackId) {
      const text = unescape(
        `No Checkin for ${messageObject.userName} on ${messageObject.date} `
      );

      //send slack message
      return SlackService.sendMessageToChannel(slackId, text, () => {});
    }
  },
};