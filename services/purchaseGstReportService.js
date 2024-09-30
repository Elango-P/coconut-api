const { Op, Sequelize, fn, col } = require('sequelize');

const { PurchaseProduct } = require('../db').models;

const Request = require('../lib/request');
const Response = require('../helpers/Response');
const SalesGstReportService = require("./SalesGstReportService");
const DateTime = require("../lib/dateTime");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
class GstService {

  static async search(req, res) {
    let companyId = Request.GetCompanyId(req);


    try {
      let { page, pageSize, startDate, endDate } = req.query;

      let timeZone = Request.getTimeZone(req);
      let start_date = DateTime.toGetISOStringWithDayStartTime(startDate)
      let end_date = DateTime.toGetISOStringWithDayEndTime(endDate)

      const where = {};

      if (startDate && !endDate) {
        where.createdAt = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date,timeZone),
          },
        };
      }

      if (endDate && !startDate) {
        where.createdAt = {
          [Op.and]: {
            [Op.lte]: DateTime.toGMT(end_date,timeZone),
          },
        };
      }

      if (startDate && endDate) {
        where.createdAt = {

          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date,timeZone),
            [Op.lte]: DateTime.toGMT(end_date,timeZone),
          },
        };
      }
      
      where.company_id = companyId;

      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.json(Response.BAD_REQUEST, {
          message: 'Invalid page',
        });
      }

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.json(Response.BAD_REQUEST, {
          message: 'Invalid page size',
        });
      }

      if (page && pageSize) {
        // Validate if page is not a number
        page = page ? parseInt(page, 10) : 1;
        if (isNaN(page)) {
          return res.json(Response.BAD_REQUEST, {
            message: 'Invalid page',
          });
        }

        // Validate if page size is not a number
        pageSize = pageSize ? parseInt(pageSize, 10) : 25;
        if (isNaN(pageSize)) {
          return res.json(Response.BAD_REQUEST, {
            message: 'Invalid page size',
          });
        }
      }

      page = page ? parseInt(page, 10) : 1;

      pageSize = pageSize ? parseInt(pageSize, 10) : 25;

      const query = {
        attributes: ['id', 'cgst_percentage', 'sgst_percentage', 'sgst_amount', 'cgst_amount', 'createdAt',"taxable_amount","net_amount"],
        where,
      };

      // Order Product Query
      const purchaseProductData = await PurchaseProduct.findAll(query);

      let data = SalesGstReportService.getSalesGstData(purchaseProductData);

      const totalSgstAmount = data.reduce((sum, item) => sum + item.sgstAmount, 0);
      const totalCgstAmount = data.reduce((sum, item) => sum + item.cgstAmount, 0);
      
      const totalNetAmount = data.reduce((sum, item) => sum + item.netAmount, 0);
      const totalTaxableAmount = data.reduce((sum, item) => sum + item.taxableAmount, 0);

      const totalAmount = totalSgstAmount + totalCgstAmount;

      //return response
      return res.json(200, {
        totalCount: data.length,
        currentPage: page,
        totalAmount,
        totalSgstAmount,
        totalCgstAmount,
        totalNetAmount,
        totalTaxableAmount,
        pageSize,
        data,
      });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = GstService;
