const { Tag } = require("../../db").models;
const errors = require("restify-errors");
const Request = require("../../lib/request");

function tagCreate(req, res, next) {
  const data = req.body;
let company_id = Request.GetCompanyId(req)
  Tag.findOne({ where: { name: data.mandatorySkills, company_id } });
  Tag.create({
    name: data.mandatorySkills,
    value: data.mandatorySkills,
  })
    .then(() => {
      res.json({ message: "Skill added" });
    })
    .catch((err) => {
      req.log.error(err);
      return next(err);
    });
}

module.exports = tagCreate;
