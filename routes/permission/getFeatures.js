// Models
const { Permission } = require("../../db").models;
const Request = require("../../lib/request")

const { Op } = require("sequelize");

function getFeatures(req, res) {
  const data = req.query;
let company_id = Request.GetCompanyId(req);
  const where = {};
  where.company_id = company_id

  const name = data.name;
  if (name) {
    where.name = { [Op.like]: `${name}` };
  }

  Permission.findAll({
    where,
    order: [["name", "ASC"]],
  }).then((permissions) => {
    const permissionsList = {};

    permissions.forEach((permission) => {
      if (!permissionsList[permission.feature_name]) {
        permissionsList[permission.feature_name] = [];
      }

      permissionsList[permission.feature_name].push(permission);
    });

    res.json(permissionsList);
  });
}

module.exports = getFeatures;
