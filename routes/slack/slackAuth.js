
const { BAD_REQUEST } = require("../../helpers/Response");
const { Company } = require("../../db").models;
const Request = require("../../lib/request");
const config = require("../../lib/config");


async function SlackAuth(req, res, next) {
    try {

        let companyId = Request.GetCompanyId(req);

        let companyDetail = await Company.findOne({
            where: { id: companyId }
        })

        if (!config.slackClientId) {
            return res.send(400, { message: 'Client Id Is Required' });
        }

        if (companyDetail && !companyDetail.portal_api_url) {
            return res.send(400, { message: 'Portal Api Url is Required' });
        }

        let scope="chat:write:user,groups:read,im:read,mpim:read,users:read,channels:read,channels:history,groups:history,mpim:history,im:history,files:write:user,files:read"

        res.send({ redirectTo: `https://slack.com/oauth/authorize?client_id=${config.slackClientId}&scope=${scope}&redirect_uri=${companyDetail.portal_api_url}/v1/slack/connect` })

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message, })
    }
};
module.exports = SlackAuth;