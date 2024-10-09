const { BAD_REQUEST } = require("../../helpers/Response");
const { Company } = require("../../db").models;
const Request = require("../../lib/request");
const config = require("../../lib/config");
const { google } = require("googleapis");

async function GoogleAuth(req, res, next) {
  try {
    let companyId = Request.GetCompanyId(req);

    let companyDetail = await Company.findOne({
      where: { id: companyId },
    });

    if (!config.googleClientId) {
      return res.send(400, { message: "Client Id Is Required" });
    }

    if (companyDetail && !companyDetail.portal_api_url) {
      return res.send(400, { message: "Portal Api Url is Required" });
    }
    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId, // Client ID
      config.googleClientSecret, // Client Secret
      `${config.baseUrl}/v1/google/connect` // Redirect URI
    );

    const scope = ["https://www.googleapis.com/auth/gmail.readonly"];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Get refresh token
      scope: scope,
    });

    res.send({ redirectTo: authUrl });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = GoogleAuth;
