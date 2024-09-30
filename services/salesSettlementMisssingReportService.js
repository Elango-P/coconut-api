const { SaleSettlement, Location: locationModel, Shift, UserIndex } = require("../db").models;
const DateTime = require("../lib/dateTime");
const Location = require("../helpers/Location");
const { ALLOW_SALE } = require("../helpers/Sales");
const { sendSaleReportMissingNotification } = require("../services/notifications/sale");
const { getSettingValue } = require("./SettingService");
const Setting = require("../helpers/Setting");
const { Op } = require("sequelize");
const AttendanceService = require("./AttendanceService");
const String = require("../lib/string");
const list = async (companyId, params = {}) => {
  let { sendSlackNotification = true } = params;
  try {
    let locationWhere = {}
    const searchTerm = params?.search ? params?.search.trim() : null;
    if (searchTerm) {
      locationWhere[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }
    let saleMissedList = new Array();
    let updatedSaleList = new Array();
    let storeData = await locationModel.findAll({
      where: {
        status: Location.STATUS_ACTIVE,
        allow_sale: ALLOW_SALE,
        company_id: companyId,
        sales_settlement_required: Location.SALES_SETTLEMENT_REQUIRED_ENABLED,
        ...locationWhere
      },
      attributes: ["name", "start_date", "end_date", "id", "allowed_shift"],
    });
    let storeList = [];
    if (storeData && storeData.length > 0) {
      for (let i = 0; i < storeData.length; i++) {
        let shiftIds = [];
        if (storeData[i] && storeData[i]?.allowed_shift) {
          let splitShiftIds = storeData[i]?.allowed_shift && storeData[i]?.allowed_shift?.split(",");
          splitShiftIds &&
            splitShiftIds.length > 0 &&
            splitShiftIds.forEach((id) => {
              shiftIds.push(id);
            });
        }
        storeList.push({
          id: storeData[i].id,
          start_date: storeData[i].start_date,
          end_date: storeData[i].end_date,
          name: storeData[i].name,
          shiftIds: shiftIds
        });
      }
    }

    const mapStoreByCompositeKey = (storeData) => {
      return storeData.reduce((map, product) => {
        const key = `${product.id}`;
        map[key] = product;
        return map;
      }, {});
    };

    let mapData = mapStoreByCompositeKey(storeList);

    const Filter = (a, b) => {
      // Sort by date in descending order
      if (new Date(a.date) > new Date(b.date)) return -1;
      if (new Date(a.date) < new Date(b.date)) return 1;
      // Sort by shift in ascending order
      if (a.shift < b.shift) return -1;
      if (a.shift > b.shift) return 1;
      // Sort by locationName in ascending order
      if (a.locationName < b.locationName) return -1;
      if (a.locationName > b.locationName) return 1;
      return 0; // If all properties are equal
    };
    let shifData = await Shift.findAll({
      attributes: ["name", "id"],
    });
    let shiftList = [];
    if (shifData && shifData.length > 0) {
      for (let i = 0; i < shifData.length; i++) {
        shiftList.push({ id: shifData[i].id, name: shifData[i].name });
      }
    }
    let dates;
    let endDate;
    let saleExist;
    let messageObject;
    let attendanceDetail;
    let slackId = await getSettingValue(Setting.SALE_REPORT_MISSING_NOTIFICATION_SLACK_CHANNEL, companyId);
    if (storeList && storeList.length > 0) {
      for (let i = 0; i < storeList.length; i++) {
        endDate = DateTime.isValidDate(params?.endDate) ? new Date(params?.endDate) : storeList[i].end_date ? storeList[i].end_date : new Date();
        if (storeList[i].start_date) {
          let shiftData = mapData[storeList[i].id]
          let shiftArray = shiftData?.shiftIds?.map(id => shiftList?.find(shift => shift?.id?.toString() === id));
          // get time range
          dates = DateTime.getDatesInRange(DateTime.isValidDate(params?.startDate) ? new Date(params?.startDate) : storeList[i].start_date, endDate);
          // validate date length exist or not
          if (dates && dates.length > 0) {
            // loop the dates
            for (let j = 0; j < dates.length; j++) {
              // validate date
              if (dates[j]) {
                // get shift list
                if (shiftArray && shiftArray.length > 0) {
                  for (let k = 0; k < shiftArray.length; k++) {
                    saleExist = await SaleSettlement.findOne({
                      where: {
                        company_id: companyId,
                        date: dates[j],
                        shift: shiftArray[k].id,
                        store_id: storeList[i].id,
                      },
                      attributes: ["id"],
                    });
                    //validaet a shift sales exist or not
                    if (slackId && sendSlackNotification) {
                      if (!saleExist) {
                        messageObject = {
                          date: DateTime.Format(dates[j]),
                          locationName: storeList[i].name,
                          companyId: companyId,
                          shift: shiftArray[k].name,
                        };
                        //send slack notification
                        await sendSaleReportMissingNotification(messageObject, slackId);
                      }
                    }
                    attendanceDetail = await AttendanceService.findOne({
                      where: {
                        company_id: companyId,
                        date: DateTime.getSQlFormattedDate(dates[j]),
                        shift_id: shiftArray[k].id,
                        store_id: storeList[i].id,
                      },
                      include: [
                        {
                          required: false,
                          model: UserIndex,
                          as: "userIndex",
                          attributes: ["first_name", "last_name","media_url"],
                        },
                      ]
                    });
                    if (!saleExist) {
                      saleMissedList.push({
                        storeId: storeList[i].id,
                        locationName: storeList[i].name,
                        date: DateTime.convertToUTC(dates[j]),
                        shift: shiftArray[k].name,
                        salesExecutiveName: String.concatName(attendanceDetail?.userIndex?.first_name, attendanceDetail?.userIndex?.last_name),
                        media_url: attendanceDetail?.userIndex?.media_url ? attendanceDetail?.userIndex?.media_url:""
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let index;
    let newData;
    let saleRecordExist;
    // combine store and shifts
    if (saleMissedList && saleMissedList.length > 0) {
      for (let i = 0; i < saleMissedList.length; i++) {
        saleRecordExist = updatedSaleList.find((data) => data.storeId == saleMissedList[i].id);
        if (saleRecordExist) {
          index = updatedSaleList.findIndex((data) => data.storeId == saleMissedList[i].id);
          updatedSaleList[index].dates.push(DateTime.formatDate(saleMissedList[i].date, "MMM DD, YYYY"));
        } else {
          newData = {
            ...saleMissedList[i],
          };
          updatedSaleList.push(newData);
        }
      }
    }
    updatedSaleList.sort(Filter);
    return updatedSaleList;
  } catch (err) {
    console.log(err);
    throw { message: err };
  }
};
module.exports = {
  list,
};
