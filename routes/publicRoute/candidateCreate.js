/* eslint-disable no-mixed-spaces-and-tabs */
const Request = require("../../lib/request");
const { Candidate } = require("../../db").models;
const ObjectName = require("../../helpers/ObjectName");
const statusService = require("../../services/StatusService");
const { loadSettingByName } = require("../../services/SettingService");
const Setting = require("../../helpers/Setting");
const ArrayList = require("../../lib/ArrayList");




async function candidateCreate(req, res, next) {

  const data = req.body;

  if (!data.firstName) {
    return res.json(400, { message: "First Name is required" });
  }

  if (!data.lastName) {
    return res.json(400, { message: "last Name is required" });
  }

  let companyId;
  let settingList = await loadSettingByName(Setting.ONLINE_SALE_COMPANY);

  if (ArrayList.isNotEmpty(settingList)) {

    let settingData = settingList.find((data) => data.value);

    companyId = settingData ? settingData.get().company_id : await Request.GetCompanyIdBasedUrl(baseUrl);

  } else {
    companyId = await Request.GetCompanyIdBasedUrl(baseUrl);
  }

  try {

    await Candidate.create({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      gender: data.gender,
      position: data.position,
      status: await statusService.getFirstStatus(ObjectName.CANDIDATE, companyId),
      company_id: companyId
    }).then(async (candidate) => {

      res.json(201, {
        message: " Candidate Added",
        candidateId: candidate.id,
      })
    }).catch((err) => {
      console.log(err);
    })

  } catch (err) {
    req.log.error(err);
    next(err);
  };
}

module.exports = candidateCreate;
