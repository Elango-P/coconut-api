const { Op, Sequelize } = require("sequelize");
const Setting = require("../helpers/Setting");
const DateTime = require("../lib/dateTime");
const Permission = require("../helpers/Permission");
const Number = require("../lib/Number");
const { getSettingValue } = require("./SettingService");
const { TransferProduct, User,Transfer: TransferModal } = require("../db").models;

class TransferProductReportService {
  static async getTransferProductCount(params,res) {
    try{
    let { user, company_id, date } = params;

    let where = {};
    where.company_id = company_id

    if (date) {
      where.createdAt = {

        [Op.and]: {
          [Op.gte]: DateTime.toGetISOStringWithDayStartTime(date),
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(date),
        },
      };
    }
    if (user) {
      where.created_by = Number.Get(user);
    }

    let query = {
      where: where,
      include: [
        {
          required: false,
          model: User,
          as: "userDetail",
        },
      ],
      attributes: [
        "created_by",
        "product_id",
        [
          Sequelize.literal(`CASE WHEN COUNT(*) > 1 THEN 1 ELSE COUNT(*) END`),
          "count",
        ],
      ],
      group: ["created_by", "product_id", "userDetail.id"],
      raw: true,
    };
    const TransferProductData = await TransferProduct.findAndCountAll(query);

    return {
      totalProductCount : TransferProductData && TransferProductData.count.length,
    };
  }catch(err){
    console.log(err);
  }
  }

  static async getCount({ company_id, user, date }, req) {
    let manageOtherPermissions = await Permission.Has(Permission.REPLENISHMENT_MANAGE_OTHERS, req);
  
    let where = {
      company_id: company_id
    };
    let timeZone = Request.getTimeZone(req);
    let start_date = DateTime.toGetISOStringWithDayStartTime(date)
    let end_date = DateTime.toGetISOStringWithDayEndTime(date)
  
    if (!manageOtherPermissions) {
      where.created_by = user;
    }
  
    let query = {
      where,
      attributes: [
        "product_id", 
        [Sequelize.fn("COUNT", "product_id"), "replenishProductCount"],
      ],
      group: ["product_id"], 
    };
  
    if (date) {
      query.where.createdAt = {
        [Op.and]: {
          [Op.gte]: DateTime.toGMT(start_date,timeZone),
          [Op.lte]: DateTime.toGMT(end_date,timeZone),
        },
      };
    }
  
    const replenishProductCounts = await TransferProduct.findAll(query);
    return replenishProductCounts && replenishProductCounts.length || 0;
  }
 
}

module.exports = TransferProductReportService;
