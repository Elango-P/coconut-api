const History = require("../../services/HistoryService");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const Response = require("../../helpers/Response");
const UserService = require("../../services/UserService");

async function loginByPassword(req, res, next) {
  try {

    let companyId = await Request.GetCompanyIdBasedUrl(req.headers.origin);

    const ip_address = Request.getIpAddress(req, res);

    let user = await UserService.logIn(companyId, req.body, ip_address);

    res.send({
      message: "User LoggedIn SuccessFully",
      user: user
    });

    res.on("finish", async () => {
      req.user = user;
      History.create("User LoggedIn", req, ObjectName.USER, user.id);
      History.create(`User IP Address Is ${ip_address}`, req, ObjectName.USER, user?.id);
    });
  } catch (err) {
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
}

module.exports = loginByPassword;
