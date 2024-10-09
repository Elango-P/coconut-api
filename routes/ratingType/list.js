const { Op } = require("sequelize");
const { BAD_REQUEST, OK } = require('../../helpers/Response');
const Number = require("../../lib/Number");
const { RatingType } = require('../../db').models;
const Request = require('../../lib/request');
const { isKeyAvailable } = require("../../lib/validator");
const RatingTypeStatus = require("../../helpers/RatingTypeStatus");

async function list(req, res, next) {
  let { type } = req.query;

  const companyId = Request.GetCompanyId(req);

  const where = {};

  where.company_id = companyId;
  if (type) {
    where.type = type
  }

  let statusValue = !isKeyAvailable(req.query,"status") ? RatingTypeStatus.ACTIVE : isKeyAvailable(req.query,"status") && Number.isNotNull(req.query?.status) ? req.query?.status : null;
  let defaultValue = isKeyAvailable(req.query,"defaultValue") && Number.isNotNull(req.query?.defaultValue) ? req.query?.defaultValue :null
  where[Op.or]= [
    { status: { [Op.or]: [statusValue, null] } },
    { id: { [Op.or]: [defaultValue, null] } }
  ]


  const query = {
    order: [['name', 'ASC']],
    where,
  };

  try {
    const ratingTypeList = await RatingType.findAndCountAll(query);

    if (ratingTypeList.count === 0) {
      return res.json({});
    }

    const data = [];

    ratingTypeList.rows.forEach((productCategory) => {
      const { id, name, type } = productCategory.get();
      data.push({
        id,
        name,
        type
      });
    });

    res.json(OK, {
      data,
    });
  } catch (err) {
    res.json(BAD_REQUEST, { message: err.message });
  }
}

module.exports = list;
