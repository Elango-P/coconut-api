const { Tag } = require("../../db").models;
const errors = require("restify-errors");
const { Op } = require("sequelize");
const Request = require("../../lib/request");

function tagAction(req, res, next) {
  const data = req.query;
  let company_id = Request.GetCompanyId(req)
  const where = {};
  where.company_id = company_id
  const search = data.search;
  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }

  Tag.findAll({ attributes: ["id", "name", "value"], where }).then((tags) =>
    res.json({ tags })
  );
}
module.exports = tagAction;
