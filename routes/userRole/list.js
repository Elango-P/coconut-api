const userRoleService = require('../../services/UserRoleService');

async function list(req, res, next) {
  try {
    userRoleService.list(req, res, next);
  } catch (err) {
    console.log(err);
  }
}

module.exports = list;
