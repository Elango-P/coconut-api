const { UserRole } = require('../db').models;
const Response = require("../helpers/Response");
const Status = require('../helpers/Status');
const DataBaseService = require('../lib/dataBaseService');
const Request = require('../lib/request');

const userRoleService = new DataBaseService(UserRole);

const isNameExist = async (name, company_id, status) => {
  try {
    if (!name) {
      return null;
    }

    const where = {
      role_name: name,
      company_id: company_id
    };

    if (status !== undefined) {
      where.status = status;
    }

    const isNameExist = await userRoleService.findOne({
      where: where,
    });

    return isNameExist;
  } catch (err) {
    console.log(err);
  }
};


const getRoleNameById = async (id) => {
  try {
    let result;
    await userRoleService.findById(id).then((data) => {
      result = data.role_name;
    });

    return result;
  } catch (err) {
    console.log(err);
  }
};

const list = async (req, res) => {
  try {
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(404, { message: 'Company Id Not Found' });
    }
    const where = {};

    where.company_id = companyId;
    where.status = Status.ACTIVE_TEXT;
    const query = {
      order: [['role_name', 'ASC']],
      where,
    };

    const roleData = await userRoleService.findAndCount(query);

    let list = [];
    for (let i in roleData.rows) {
      let { id, role_name } = roleData.rows[i];

      let data = {
        id: id,
        name: role_name,
      };
      list.push(data);
    }
    res.send(Response.OK, {
      data: list,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  userRoleService,
  isNameExist,
  getRoleNameById,
  list,
};
