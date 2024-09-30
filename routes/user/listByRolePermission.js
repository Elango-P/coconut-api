const { User: userModel } = require('../../db').models;
const DataBaseService = require('../../lib/dataBaseService');
const userService = new DataBaseService(userModel);
const Request = require('../../lib/request');
const { OK } = require('../../helpers/Response');
const Permission = require('../../helpers/Permission');
const { Op } = require('sequelize');
const { concatName } = require('../../lib/string');
const User = require('../../helpers/User');
const UserService = require("../../services/UserService");

async function listByRolePermission(req, res, next) {
  try {
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(404, { message: 'Company Id Not Found' });
    }

    const where = {};

    where.company_id = companyId;

    const query = {
      order: [['name', 'ASC']],
      where,
    };

    let { allowedRoleIds } = await UserService.listByRolePermission(
      Permission.SALE_SETTLEMENT_ADD,
      companyId
    );

    if (allowedRoleIds && allowedRoleIds.length > 0) {
      where.role = { [Op.in]: allowedRoleIds };
    }

    const userDetails = await userService.find(query);

    let activeList = [];
    let inActiveList = [];

    if (userDetails && userDetails.length > 0) {
      for (let i in userDetails) {
        let { id, name, last_name, media_url, status } = userDetails[i];

        if (status == User.STATUS_ACTIVE) {
          let list = {
            label: concatName(name, last_name),
            first_name: name,
            last_name: last_name,
            value: id,
            media_url: media_url,
          };
          activeList.push(list);
        }

        if (status == User.STATUS_INACTIVE) {
          let list = {
            label: concatName(name, last_name),
            first_name: name,
            last_name: last_name,
            value: id,
            media_url: media_url,
          };
          inActiveList.push(list);
        }
      }
    }
    res.send(OK, {
      data: { activeList: activeList, inActiveList: inActiveList },
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = listByRolePermission;
