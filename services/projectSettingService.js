//Service

// Model
const {

  ProjectSettingModel,
} = require("../db").models;
const { MEDIA_PATH_SETTING } = require("../lib/s3FilePath");

const slug = require("slug");
const async = require("async");
//Common
const { uploadBase64File } = require("../lib/s3");
const { portalService } = require("./PortalService");
const { companyService } = require("./CompanyService");
const { SETTING } = require("../helpers/Setting");

class projectSettingService {
//Get Setting Value
static getProjectSettingValue = async (name, companyId,projectId) => {
    try {
        if (!name) {
            return null;
        }
        const settingDetails = await ProjectSettingModel.findOne({
            attributes: ["value"],
            where: { name, company_id: companyId, project_id:projectId },
        });

        return settingDetails && settingDetails.value
            ? settingDetails.value
            : "";
    } catch (err) {
        console.log(err);
    }
};

static list = async (companyId) => {
    try {
        if (!companyId) {
            return null;
        }
        const settingDetails = await ProjectSettingModel.findAll({
            where: { company_id: companyId },
        });

        return settingDetails && settingDetails;
    } catch (err) {
        console.log(err);
    }
};


}


module.exports = projectSettingService;

