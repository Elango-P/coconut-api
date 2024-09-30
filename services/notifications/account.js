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
  sendAddBillNotification: async (companyId, callback) => {
    //validate company Id exist or not
    if (!companyId) {
      return callback();
    }
    //get slack Id from setting
    let slackId = await getSettingValue(SettingConstants.ACCOUNT_MESSAGE_SLACK_CHANNEL, companyId);

    //validate slack id exist or not
    if (slackId) {
      const text = unescape(
        ` Added the bill `
      );

      //send slack message
      return SlackService.sendMessageToChannel(slackId, text, () => callback());
    }
  },
};
