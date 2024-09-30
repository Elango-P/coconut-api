const { Op } = require("sequelize");
const DataBaseService = require("../lib/dataBaseService");
const DateTime = require("../lib/dateTime");
const Currency = require("../lib/currency");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const { getSettingValue } = require("./SettingService");

const { order, Location } = require("../db").models;
const orderService = new DataBaseService(order);
class OrderTop50ReportService {
  static async list(timeZone,company_id) {

    let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
    let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())

    let where = {};
    where.company_id = company_id;

    where.date = {
      [Op.and]: {
        [Op.gte]: DateTime.toGMT(start_date,timeZone),
        [Op.lte]: DateTime.toGMT(end_date,timeZone),
      },
    };

    let query = {
      order: [["total_amount", "DESC"]],
      include: [
        {
          required: true,
          model: Location,
          as: "location",
          attributes: ["name", "id"],
        },
      ],
      where,
      limit: 50,
    };
    let orderList = await orderService.findAndCount(query);
    let orderData = orderList && orderList.rows;
    let list = [];
    if (orderData && orderData.length > 0) {
      for (let i = 0; i < orderData.length; i++) {
        const { order_number, location, total_amount } = orderData[i];
        list.push({
          location_name: location?.name ? location?.name : "'",
          order_number: order_number ? order_number : "",
          total_amount: total_amount ? Currency.IndianFormat(total_amount) : "",
        });
      }
    }

    return list && list;
  }
}

module.exports = OrderTop50ReportService;
