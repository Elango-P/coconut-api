const restify = require("restify");
const config = require("../lib/config");
const errors = require("restify-errors");
const { companyService } = require("../services/CompanyService");
const { getSettingValue } = require("../services/SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const Request = require("../lib/request");
const Number = require("../lib/Number");
const Response = require("../helpers/Response");

module.exports = async (req, res, next) => {
  const token = req.header("authorization");
  if (!token) {
    return next(new errors.UnauthorizedError("Missing authorization header"));
  }

  if (token) {
    if (token !== config.schedulerApiKey) {
     return  res.json(Response.BAD_REQUEST, { message: "Scheduler api key is incorrect" });
    }
    let user= {}
    const company_id = Request.GetCompanyId(req);

    if (Number.isNotNull(company_id)) {
      const companyDetails = await companyService.findOne({
        where: { id: company_id },
        attributes: ["id", "time_zone"],
      });
      if (companyDetails && companyDetails?.time_zone) {
        user.time_zone = companyDetails?.time_zone;
        user.company_id = companyDetails?.id
        req.user = user
      } else if(Number.isNotNull(company_id)){
        const defaultTimeZone = await getSettingValue(
          USER_DEFAULT_TIME_ZONE,
          company_id
        );
        user.time_zone = defaultTimeZone;
        user.company_id = companyDetails?.id
        req.user = user
      }
    }

    return next();
  }
};
