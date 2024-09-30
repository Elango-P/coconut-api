const { User: userModel } = require('../../db').models;
const DataBaseService = require('../../lib/dataBaseService');
const userService = new DataBaseService(userModel);
const Request = require('../../lib/request');
const { OK } = require('../../helpers/Response');
const User = require('../../helpers/User');
const Permission = require("../../helpers/Permission");
const { isKeyAvailable } = require("../../lib/validator");
const Number = require("../../lib/Number");
const { Op } = require("sequelize");
async function list(req, res, next) {
  try {

    const companyId = Request.GetCompanyId(req);

    const userId = Request.getUserId(req);

    if (!companyId) {
      return res.json(404, { message: 'Company Id Not Found' });
    }
    let data = req.query;
    const where = {};

    where.company_id = companyId;

    let statusValue = !isKeyAvailable(data,"status") ? User.STATUS_ACTIVE : isKeyAvailable(data,"status") && Number.isNotNull(data?.status) ? data?.status : null;
    let defaultValue = isKeyAvailable(data,"defaultValue") && Number.isNotNull(data?.defaultValue) ? data?.defaultValue :null
    where[Op.or]= [
      { status: { [Op.or]: [statusValue, null] } },
      { id: { [Op.or]: [defaultValue, null] } }
    ]
  

    const query = {
      order: [['name', 'ASC']],
      where,
    };

    const userDetails = await userService.findAndCount(query);
    let list = [];
    for (let i in userDetails.rows) {
      let { id, name, last_name, media_url } = userDetails.rows[i];
      let logedInUserData = {};
      if (req.user.id == id) {
        (logedInUserData.id = id),
          (logedInUserData.first_name = name),
          (logedInUserData.last_name = last_name),
          (logedInUserData.media_url = media_url),
          (logedInUserData.isLogedInUser = true);
      }

      let data = {
        id: id,
        first_name: name,
        last_name: last_name,
        media_url: media_url,
        ...logedInUserData,
      };

      list.push(data);
    }
    res.send(OK, {
      data: list,
      loggedInUserId: userId,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = list;
