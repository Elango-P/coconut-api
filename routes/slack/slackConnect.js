
const { BAD_REQUEST } = require("../../helpers/Response");
const CompanyService = require("../../services/CompanyService");
const request = require("request");
const Setting = require("../../helpers/Setting");
const config = require("../../lib/config");
const { saveSetting } = require('../../services/SettingService');


async function SlackConnect(req, res, next) {
    try {

        const { code } = req.query;

        const hostUrl = req && req.headers && req.headers.host;

        let companyId = await CompanyService.getCompanyIdByPortalUrl(hostUrl);

        if(!companyId){
            return res.send(400, { message: 'Company Id Is Required' });
        }

        if(!config.slackClientId){
            return res.send(400, { message: 'Client Id Is Required' });
        }

        if(!config.slackClientSecret){
            return res.send(400, { message: 'Client Secret id Is Required' });
        }

        let companyDetail = await CompanyService.getCompanyDetailById(companyId);


        let body = {
            client_id: config.slackClientId,
            client_secret: config.slackClientSecret,
            code: code,
            grant_type: "authorization_code",
        }

        const option = {
            url: `https://slack.com/api/oauth.access`,
            method: "POST",
            json: true,
            headers: {
                Accept: "application/json",
                Connection: "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            form: body,
        };

        request.post(option, async (error, response, body) => {

            if (body) {
                saveSetting(Setting.SLACK_ACCESS_TOKEN, body.access_token, companyId);
                saveSetting(Setting.SLACK_REFRESH_TOKEN, body.refresh_token, companyId);
            }
            return res.redirect(
                `${companyDetail.portal_url}/setting/Integrations/Slack`, next
            );
        });


    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};

module.exports = SlackConnect;