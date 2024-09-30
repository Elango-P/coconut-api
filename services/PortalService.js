const { Op } = require("sequelize");
const { Portal } = require("../db").models;
const DataBaseService = require("../lib/dataBaseService");

const portalService = new DataBaseService(Portal);

const isNameExist = async (name) => {
  try {
    if (!name) {
      return null;
    }
    const isNameExist = await portalService.findOne({
      where: { portal_name: name },
    });
    return isNameExist;
  } catch (err) {
    console.log(err);
  }
};
const isUrlExist = async (url) => {
  try {
    if (!url) {
      return null;
    }
    const isUrlExist = await portalService.findOne({
      where: { portal_url: url },
    });
    return isUrlExist;
  } catch (err) {
    console.log(err);
  }
};

const getPortalFromRequest = async (req, id) => {
  try {
    let portal;
    let portalUrl = req.headers.origin;
    if (id) {
      const portalDetails = await portalService.findOne({
        attributes: ["id", "portal_name", "portal_url", "company_id"],
        where: { id: id },
      });
      if (!portalDetails) {
        return "";
      }
      if (portalDetails) {
        portal = portalDetails;
      }
    } else {
      const portalDetails = await portalService.findOne({
        attributes: ["id", "portal_name", "portal_url", "company_id"],
        where: { portal_url: { [Op.like]: portalUrl } },
      });
      if (!portalDetails) {
        return "";
      }
      if (portalDetails) {
        portal = portalDetails;
      }
    }
    if (portal) return portal;
  } catch (err) {
    console.log(err);
  }
};

const getPortalUrlByRequest = (req) => {
  if (!req) {
    return null;
  } else {
    let baseUrl = req.headers.origin;
    return baseUrl;
  }
};
module.exports = {
  portalService,
  isNameExist,
  isUrlExist,
  getPortalFromRequest,
};
