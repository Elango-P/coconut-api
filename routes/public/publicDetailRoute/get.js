// utils
const { PORTAL_HEADER_COLOR, PORTAL_LOGO_MEDIA_URL } = require("../../../helpers/Setting");
const DataBaseService = require("../../../lib/dataBaseService");
const { Setting } = require("../../../db").models;

// import service
const { companyService } = require("../../../services/CompanyService");

const { Op } = require("sequelize");
const settingModel = new DataBaseService(Setting);

async function get(req, res, next) {
  try {
    const baseUrl = req.header("origin");

    if (!baseUrl) {
      return res.json(400, { message: "Base url is required" });
    }

    try {
      const companyDetails = await companyService.findOne({
        where: { portal_url: { [Op.iLike]: baseUrl } },
        attributes: { exclude: ["deletedAt"] },
      });

      const getSettingDetails = await settingModel.findAndCount({
        where: {
          company_id: companyDetails?.id,
        },
      });
      const settingValue = getSettingDetails && getSettingDetails.rows;

      if (!companyDetails) {
        return res.json(400, { message: "Company not found" });
      }

      const data = {
        id: companyDetails.id,
        company_name: companyDetails.company_name,
      };

      for (let i = 0; i < settingValue.length; i++) {
        const value = settingValue[i];
        if (value.name === PORTAL_LOGO_MEDIA_URL) {
          data.portal_logo_media_url = value?.value;
        }
        if (value.name === PORTAL_HEADER_COLOR) {
          data.portal_header_color = value?.value;
        }
      }

      res.json(200, data);
    } catch (err) {
      res.json(400, { message: err.message });
      next(err);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = get;
