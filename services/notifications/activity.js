// Slack Notification
const slack = require("../../services/slack/chat");
const config = require("../../lib/config");

// Get Slack Channel Id
const SLACK_MESSAGE_TYPE_BOT = 1;

module.exports = {
  /**
   * Send activity approval notification
   *
   * @param {*} slackId
   * @param {*} callback
   */
  sendActivityApprovalNotification: (
    slackId,
    loggedInSlackId,
    name,
    activityName,
    callback
  ) => {
    if (!slackId) {
      return callback();
    }

    if (slackId !== loggedInSlackId) {
      const text = unescape(
        `<@${slackId}> Your activity (*${activityName}*) has been approved by <@${loggedInSlackId}> \n`
      );

      slack.sendMessage(slackId, text, SLACK_MESSAGE_TYPE_BOT, () =>
        callback()
      );
    }
  },

  /**
   * Send Activity Add Comments
   *
   * @param activityData
   * @param slackWebHookKey
   * @param callback
   */
  sendActivityAddNotification: (slackId,ActivitySlackId, activityData, callback) => {
    if (!slackId) {
      return callback();
    }

      const actualHours = activityData.actualHours
        ? ` - ${activityData.actualHours}`
        : "";

      const text = unescape(
        `<@${slackId}> ${activityData.userName} added ${activityData.activity} \n ${activityData.activity} ${actualHours} \n ${activityData.comments}`
      );

      return slack.sendMessageToChannel(ActivitySlackId, text, () => callback());
  },

  /**
   * Send Ticket Activity Add Notification
   *
   * @param activityData
   * @param callback
   */
  sendTicketActivityAddNotification: (
    slackId,
    activitySlackId,
    activityData,
    ticketId,
    projectSlug,
    callback
  ) => {
    if (!slackId) {
      return callback();
    }


      const TicketUrl = `<${config.webUrl}/tickets/${projectSlug}/${ticketId}|${ticketId} > `;

      const text = unescape(
        `<@${slackId}> added activity \n [${activityData.activity}]  ${TicketUrl} ${activityData.comments}`
      );

      return slack.sendMessageToChannel(activitySlackId, text, () => callback());
  },

  /**
   * Send Ticket Activity Complete Notification
   *
   * @param activityData
   * @param callback
   */
  sendTicketActivityCompleteNotification: (
    slackId,
    activitySlackId,
    activityData,
    ticketId,
    projectSlug,
    status,
    holdStatusUpdateReason,
    callback
  ) => {
    if (!slackId) {
      return callback();
    }

      const TicketUrl = `<${config.webUrl}/tickets/${projectSlug}/${ticketId}|${ticketId} > `;
      const holdStatusUpdate = `Reason : ${holdStatusUpdateReason}`;

      const text = unescape(
        `<@${slackId}> Changed activity status \n [${activityData.activity} : ${status}] - ${TicketUrl} ${activityData.comments} \n ${holdStatusUpdateReason ? holdStatusUpdate : " " }`
      );

      return slack.sendMessageToChannel(activitySlackId, text, () => callback());
  },

  /**
   * Send Ticket Activity Complete Notification
   *
   * @param activityData
   * @param callback
   */
  sendAddScreenshotNotification: (slackId,acitvitySlackId, image, callback) => {
    if (!slackId) {
      return callback();
    }

      return slack.sendImageToChannel(acitvitySlackId, image, () => callback());
  },
};
