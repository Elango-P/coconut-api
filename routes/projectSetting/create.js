// import service
const { ProjectSettingModel } = require('../../db').models;
const Response = require('../../helpers/Response');
const DataBaseService = require('../../lib/dataBaseService');
const Request = require('../../lib/request');
const projectSettingService = new DataBaseService(ProjectSettingModel);

const async = require('async');

async function saveProjectSetting(name, value, params) {
  try {
    const settingData = {
      name: name,
      value: value,
      company_id: params.company_id,
      project_id: params.projectId,
    };

    const isSettingExist = await projectSettingService.findOne({
      where: { name: name, company_id: params.company_id, project_id: params.projectId },
    });

    if (isSettingExist) {
      await projectSettingService.update(settingData, {
        where: { name: name, project_id: params.projectId, company_id: params.company_id },
      });
    } else {
      await projectSettingService.create(settingData);
    }
  } catch (err) {
    console.log(err);
  }
}

async function create(req, res, next) {
  try {
    const data = req.body;
    let companyId = Request.GetCompanyId(req);
    let params = {
      company_id: companyId,
      projectId: req.query.project_id,
    };

    async
      .eachSeries(Object.keys(data), async (key, cb) => await saveProjectSetting(key, data[key], params, cb))
      .then(() => {
        res.send(Response.OK, { message: 'Setting Saved' });
      });
  } catch (err) {
    console.log(err);
  }
}

module.exports = create;
