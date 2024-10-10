const errors = require("restify-errors");
const validator = require("../../lib/validator");
const UserService = require("../../services/UserService");
const Request = require("../../lib/request");
const { User } = require("../../db").models;

function forceLogout(req, res, next) {

  let companyId = Request.GetCompanyId(req)

  const { ids } = req.body;

  if (!ids) {
    return next(validator.validationError("user ids"));
  }

  let userIds = ids && ids.split(",")

  User.update(
    { session_id: null },
    {
      where: { id: { $in: ids.split(",") }, company_id: companyId },
    }
  )
    .then(() => {
      res.json({ message: "User forced logged out successfully" });
      res.on("finish", async () => {
        if(userIds && userIds.length > 0){
          for (let i = 0; i < userIds.length; i++) {
            const userId = userIds[i];
            await UserService.reindex(userId,companyId)
          }
        }
      })
    })
    .catch((err) => {
      req.log.error(err);
      return next(err);
    });
}

module.exports = forceLogout;
