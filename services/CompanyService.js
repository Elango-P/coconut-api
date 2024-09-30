const { Company } = require("../db").models

const DataBaseService = require("../lib/dataBaseService")

const companyService = new DataBaseService(Company);

const { Op } = require('sequelize');

const isNameExist = async (name) => {
    try {
        if (!name) {
            return null;
        }
        const isNameExist = await companyService.findOne({
            where: { company_name: name },
        });
        return isNameExist;
    } catch (err) {
        console.log(err);
    }
};

// Get company detail by company id
const getCompanyDetailById = async (id) => {
    try {
        if (!id) {
            return null;
        }
        const companyDetail = await companyService.findOne({
            where: { id }
        })
        return companyDetail;
    } catch (err) {
       console.log(err);
    }
}

const getCompanyIdByPortalUrl = async (portalUrl) => {
    try {
        if (!portalUrl) {
            return null;
        }
        const companyDetail = await companyService.findOne({
            where: { portal_api_url : { [Op.iLike]: `%${portalUrl}%`  } }
        })
        return companyDetail && companyDetail.id;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    companyService,
    isNameExist,
    getCompanyDetailById,
    getCompanyIdByPortalUrl
};
