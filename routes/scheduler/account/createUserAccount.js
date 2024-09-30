const { SchedulerJob, User, account } = require("../../../db").models;

// Lib
const Request = require("../../../lib/request");

const schedulerJobCompanyService = require("../schedularEndAt");
const History = require("../../../services/HistoryService");
const ObjectName = require("../../../helpers/ObjectName");
const DataBaseService = require("../../../lib/dataBaseService");
const SchedulerJobService = new DataBaseService(SchedulerJob);

const {
  getSettingList,
  getValueByObject,
} = require("../../../services/SettingService");
const Setting = require("../../../helpers/Setting");
const { Op } = require("sequelize");
const AccountTypeService = require("../../../services/AccountTypeService");
const Account = require("../../../helpers/Account");
const Status = require("../../../helpers/Status");
const Response = require("../../../helpers/Response");
const PhoneNumber = require("../../../lib/PhoneNumber");

module.exports = async function (req, res) {
  const schedularData = await SchedulerJobService.findOne({
    where: { id: Request.GetId(req), company_id: Request.GetCompanyId(req) },
  });

  let settingArray = [];
  let settingList = await getSettingList(Request.GetCompanyId(req));

  for (let i = 0; i < settingList.length; i++) {
    settingArray.push(settingList[i]);
  }

  const systemUser = await getValueByObject(Setting.SYSTEM_USER, settingArray);

  let params = {
    companyId: Request.GetCompanyId(req),
    id: Request.GetId(req),
    name: schedularData?.name,
    systemUser: systemUser,
    settingArray: settingArray,
    startDate: schedularData?.start_date,
    endDate: schedularData?.end_date,
  };

  res.send(Response.OK, { message: `Job Started` });

  res.on("finish", async () => {
    try {
      History.create(
        `${schedularData?.name} Job Started`,
        req,
        ObjectName.SCHEDULER_JOB,
        Request.GetId(req),
        systemUser
      );
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      let accountTypeIds = await AccountTypeService.getAccountTypeByCategory(
        Account.CATEGORY_USER,
        Request.GetCompanyId(req)
      );
      let userData = await User.findAll({
        where: {
          company_id: Request.GetCompanyId(req),
          account_id: { [Op.eq]: null },
        },
        attributes: ["name", "id", "email", "mobile_number1"],
      });

      if (userData && userData.length > 0) {
        for (let i = 0; i < userData.length; i++) {
          let accountObj = {
            name: userData[i]?.name,
            email: userData[i]?.email,
            status: Status.ACTIVE,
            mobile:
              userData[i].mobile_number1 &&
              PhoneNumber.Get(userData[i]?.mobile_number1),
            type: accountTypeIds[0],
            company_id: Request.GetCompanyId(req),
          };
          let accountData = await account.create(accountObj);

          if (accountData && accountData?.id) {
            await User.update(
              { account_id: accountData?.id },
              {
                where: {
                  id: userData[i]?.id,
                  company_id: Request.GetCompanyId(req),
                },
              }
            );
          }
        }
      }

      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
};
