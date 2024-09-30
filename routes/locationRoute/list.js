// Status
const { BAD_REQUEST, OK } = require('../../helpers/Response');
const Request = require('../../lib/request');
const DataBaseService = require('../../lib/dataBaseService');
const Location = require('../../helpers/Location');
const Number = require("../../lib/Number");
const { isKeyAvailable } = require("../../lib/validator");
const { Op } = require("sequelize");
const { Location:locationModel } = require('../../db').models;
const LocationModel = new DataBaseService(locationModel);

async function list(req, res, next) {
    try {

        let companyId = Request.GetCompanyId(req);

        let { type }=req.query;

        if (!companyId) {
            return res.send(404, { message: 'Company Not Found' });
        }

        let where = {};
        where.company_id = companyId;

        let statusValue = !isKeyAvailable(req.query,"status") ? Location.STATUS_ACTIVE : isKeyAvailable(req.query,"status") && Number.isNotNull(req.query?.status) ? req.query?.status : null;
        let defaultValue = isKeyAvailable(req.query,"defaultValue") && Number.isNotNull(req.query?.defaultValue) ? req.query?.defaultValue :null
        where[Op.or]= [
          { status: { [Op.or]: [statusValue, null] } },
          { id: { [Op.or]: [defaultValue, null] } }
        ]

        if(Number.isNotNull(type)){
            where.type = type
        }
        const query = {
            order: [['sort_order', 'ASC']],
            where,
        };

        const storeModelValues = await LocationModel.findAndCount(query);
        let list = [];
        for (let i in storeModelValues.rows) {
            let { id, name, ip_address, allowed_shift } = storeModelValues.rows[i];

            let data = {
                id: id,
                name: name,
                IpAddress: ip_address,
                allowedShift: allowed_shift
            };
            list.push(data);
        }
        res.json(OK, {
            data: list,
        });
    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }
}
module.exports = list;
