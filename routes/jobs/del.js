const { Jobs } = require("../../db").models;
const validator = require("../../lib/validator");
const errors = require("restify-errors");
const Request = require("../../lib/request")

function del(req, res, next) {
  const id = req.params.id;
let company_id = Request.GetCompanyId(req)
  if (!validator.isInteger(id)) {
    return next(new errors.BadRequestError("Job details not found"));
  }

  Jobs.findOne({
    where: { id, company_id },
  }).then((Job) => {
    if (!Job) {
      return next(new errors.NotFoundError("Job details not found"));
    }
    Job.destroy()
      .then(() => {
        res.json({ message: "Job deleted" });
      })
      .catch((err) => {
        req.log.error(err);
        return next(err);
      });
  });
}
module.exports = del;
