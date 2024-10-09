const { BAD_REQUEST } = require("../../helpers/Response");
const CompanyService = require("../../services/CompanyService");
const request = require("request");
const Setting = require("../../helpers/Setting");
const config = require("../../lib/config");
const { saveSetting } = require("../../services/SettingService");
const { google } = require("googleapis");

async function GoogleConnect(req, res, next) {
  try {
    const { code } = req.query;

    const hostUrl = req && req.headers && req.headers.host;

    let companyId = await CompanyService.getCompanyIdByPortalUrl(hostUrl);

    if (!companyId) {
      return res.send(400, { message: "Company Id Is Required" });
    }

    if (!config.googleClientId) {
      return res.send(400, { message: "Client Id Is Required" });
    }

    if (!config.googleClientSecret) {
      return res.send(400, { message: "Client Secret id Is Required" });
    }

    let companyDetail = await CompanyService.getCompanyDetailById(companyId);

    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId, // Client ID
      config.googleClientSecret, // Client Secret
      `${config.baseUrl}/v1/google/connect` // Redirect URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (tokens && tokens.access_token) {
      saveSetting(Setting.GOOGLE_ACCESS_TOKEN, tokens.access_token, companyId);
    }
    if (tokens && tokens.refresh_token) {
      saveSetting(
        Setting.GOOGLE_REFRESH_TOKEN,
        tokens.refresh_token,
        companyId
      );
    } else {
      if (tokens && tokens.access_token) {
        await oauth2Client.revokeToken(tokens.access_token);
      }
    }

    return res.redirect(
      `${companyDetail?.portal_url}/setting/Integrations/Google`,
      next
    );
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}

module.exports = GoogleConnect;
