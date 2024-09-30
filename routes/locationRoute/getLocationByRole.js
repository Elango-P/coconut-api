// Status
const { BAD_REQUEST, OK } = require('../../helpers/Response');
const Request = require('../../lib/request');
const DataBaseService = require('../../lib/dataBaseService');
const Location = require('../../helpers/Location');
const Setting = require('../../helpers/Setting');
const ObjectName = require('../../helpers/ObjectName');
const { getSettingValueByObject } = require('../../services/SettingService');
const { Op } = require('sequelize');
const ValidationService = require("../../services/ValidationService");
const { Location:locationModel } = require('../../db').models;
const LocationModel = new DataBaseService(locationModel);

async function getLocationByRole(req, res, next) {
    try {
        let companyId = Request.GetCompanyId(req);

        if (!companyId) {
            return res.send(404, { message: 'Company Not Found' });
        }
        const roleId = Request.getUserRole(req)

        const ip_address = Request.getIpAddress(req, res);

        await ValidationService.ValidateLocation(roleId, ip_address, companyId, 'checkin');


        let allowedLocationsValues = await getSettingValueByObject(Setting.ALLOWED_LOCATIONS, companyId, roleId, ObjectName.ROLE);

        let where = {};
        where.company_id = companyId;
        where.status = Location.STATUS_ACTIVE;
        if(allowedLocationsValues){ 
            const allowedLocationIdsArray = allowedLocationsValues && allowedLocationsValues.split(',');

        where.id = {
            [Op.in]: allowedLocationIdsArray,
          };

        }
       
        const query = {
            order: [['name', 'ASC']],
            where,
        };

        const storeModelValues = await LocationModel.findAndCount(query);
        let list = [];
          for (const allowedLocation of storeModelValues.rows) {
            let { id, name, ip_address } = allowedLocation;

            let data = {
                id: id,
                name: name,
                IpAddress: ip_address
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
module.exports = getLocationByRole;
