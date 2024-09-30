const { SchedulerJob } = require("../../../db").models;

// Lib
const Request = require("../../../lib/request");

const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const DataBaseService = require("../../../lib/dataBaseService");
const SchedulerJobService = new DataBaseService(SchedulerJob);
const saleSettlementMissingService = require("../../../services/saleSettlementMissingService");
const { getSettingList, getValueByObject } = require("../../../services/SettingService");
const Setting = require("../../../helpers/Setting");

module.exports = async function (req, res) {

  const schedularData = await SchedulerJobService.findOne({
    where: { id: Request.GetId(req), company_id: Request.GetCompanyId(req) },
  });

  let settingArray = [];
  let settingList = await getSettingList(Request.GetCompanyId(req));

  for (let i = 0; i < settingList.length; i++) {
    settingArray.push(settingList[i]);
  }
  const systemUser = await getValueByObject(Setting.SYSTEM_USER,settingArray);

  let params = { companyId: Request.GetCompanyId(req), id: Request.GetId(req), name:schedularData?.name, systemUser:systemUser,settingArray:settingArray};


  res.send(200, { message: `Job Started` });

  res.on("finish", async () => {
    try {
      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, Request.GetId(req),systemUser);
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      await saleSettlementMissingService.list(req, res, params);
    } catch (err) {
      console.log(err);
    }
  });
};
