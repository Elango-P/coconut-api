const request = require("request");

// Slack Notification
const slack = require("./slack/chat");

const slackNotificationService = module.exports = {

	/**
	 * Slack Notification
	 *
	 * @param data
	 * @param slackWebhookKey
	 * @param callback
	 * @returns {*}
	 */
	slackNotification: (data, slackWebhookKey, callback) => {
		if (!slackWebhookKey) {
			return callback();
		}
		const payload = {
			json: {
				username: "Tracker",
				icon_url: "http://thidiff.com/images/icons/thidiff-icon.png",
				attachments: data
			}
		};

		request.post(`https://hooks.slack.com/services/${slackWebhookKey}`, payload, () => callback());
	}
};
