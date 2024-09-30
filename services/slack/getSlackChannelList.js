const Request = require("request");

const config = require("../../lib/config");

module.exports = async (callback) => {

    if (!config.slack_user_oauth_access_token) {
        throw { message: "Missing Slack Access Token" };
    }

    try {
        // Get slack channel list
        Request.get(
            {
                headers: {
                    Authorization: `Bearer ${config.slack_user_oauth_access_token}`,
                    "Content-Type": "application/json",
                },
                url: `https://slack.com/api/conversations.list`,
            },
            (error, response, body) => {

                const err = (error && error.message) || "";

                if (err) {
                    return callback(err,null);
                }
                const result = JSON.parse(body);
                const channels = (result && result.channels) || [];

                return callback(null,channels);
            }
        );
    } catch (err) {
        return callback(err, null);
    }
};
