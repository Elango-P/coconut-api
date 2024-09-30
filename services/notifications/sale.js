// Slack Notification

const SettingConstants = require("../../helpers/Setting");

const { getSettingValue } = require("../SettingService");
const SlackService = require("../SlackService");

module.exports = {
  /**
   * Send Bill Notification
   *
   * @param activityData
   * @param callback
   */
  sendSaleReportMissingNotification: async (messageObject, slackId) => {
    //validate company Id exist or not
    if (messageObject && !messageObject.companyId) {
      return null;
    }

    //validate slack id exist or not
    if (slackId) {
      const text = unescape(
        ` Sales Report missing for "${messageObject.locationName}" on "${messageObject.date}" (${messageObject.shift}) `
      );

      //send slack message
      return SlackService.sendMessageToChannel(slackId, text, () => {});
    }
  },
};
