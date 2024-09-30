const { Op } = require("sequelize");
const Setting = require("../helpers/Setting");
const DateTime = require("../lib/dateTime");
const Request = require("../lib/request");
const { fineService } = require("./FineBonusService");
const { getSettingValue } = require("./SettingService");
const { Attendance, StockEntryProduct, Tag } = require("../db").models;

const addFineForNoStockEntry = async (req, res, next) => {
  let companyId = Request.GetCompanyId(req);

  let userDefaultTimeZone = Request.getTimeZone(req)
  let todayDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(userDefaultTimeZone));
  let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
  let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())

  let attendanceList = await Attendance.findAll({
    where: { company_id: companyId, date: todayDate },
    attributes: ["user_id"],
  });
  let todayAttendanceUserIds =
    attendanceList && attendanceList.length > 0 && attendanceList.map((data) => data?.user_id);

  if (todayAttendanceUserIds && todayAttendanceUserIds.length > 0) {
    for (let i = 0; i < todayAttendanceUserIds.length; i++) {
      const userId = todayAttendanceUserIds[i];

      let stockEntryProductCount = await StockEntryProduct.count({
        where: {
          company_id: companyId,
          owner_id: userId,
          createdAt: {
            [Op.and]: {
              [Op.gte]: DateTime.toGMT(start_date,userDefaultTimeZone),
              [Op.lte]: DateTime.toGMT(end_date,userDefaultTimeZone),
            },
          },
        },
      });
      if (stockEntryProductCount <= 0) {
        let type = await getSettingValue(Setting.STOCK_ENTRY_MISSING_FINE_TYPE, companyId);
        if (type && type !== undefined) {
          const tagDetail = await Tag.findOne({
            where: { id: type, company_id: companyId },
          });
          if (tagDetail && tagDetail !== undefined) {
            let default_amount = (tagDetail && tagDetail?.default_amount) || 0;
            let createData = {
              user: userId,
              type: type,
              amount: default_amount,
              company_id: companyId,
            };
            await fineService.create({ body: createData }, null, null);
          }
        }
      }
    }
  }
};

module.exports = addFineForNoStockEntry;
