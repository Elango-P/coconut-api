const { Op, Sequelize, fn, col } = require('sequelize');

const { orderProduct } = require('../db').models;

const Request = require('../lib/request');
const Response = require('../helpers/Response');
const Number = require('../lib/Number');
const DateTime = require('../lib/dateTime');
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const ObjectHelper = require("../helpers/ObjectHelper");
class GstService {
  static getData(orderProductData, showTotal) {
    try {
      //  Set Order Product In an Array
      let orderProductArray = [];

      let objData = {};

      // Order Product Loop
      for (let i = 0; i < orderProductData.length; i++) {
        objData = {
          cgst_percentage: orderProductData[i].cgst_percentage,
          sgst_percentage: orderProductData[i].sgst_percentage,
          sgst_amount: orderProductData[i].sgst_amount,
          cgst_amount: orderProductData[i].cgst_amount,
          price: orderProductData[i].price,
          taxable_amount: orderProductData[i].taxable_amount,
          id: orderProductData[i].id,
        };
        orderProductArray.push(objData);
      }

      // Group the sgst Data
      const groupedSgstData = orderProductArray.reduce((acc, { sgst_percentage, sgst_amount }) => {
        if (!acc[sgst_percentage]) {
          acc[sgst_percentage] = 0;
        }
        acc[sgst_percentage] += Number.GetFloat(sgst_amount);
        return acc;
      }, {});

       // Group the sgst Data
       const groupedNetAmountData = orderProductArray.reduce((acc, { sgst_percentage, price }) => {
        if (!acc[sgst_percentage]) {
          acc[sgst_percentage] = 0;
        }
        acc[sgst_percentage] += Number.GetFloat(price);
        return acc;
      }, {});

       // Group the sgst Data
       const groupedTaxableAmountData = orderProductArray.reduce((acc, { sgst_percentage, taxable_amount }) => {
        if (!acc[sgst_percentage]) {
          acc[sgst_percentage] = 0;
        }
        acc[sgst_percentage] += Number.GetFloat(taxable_amount);
        return acc;
      }, {});


      const groupedTaxableAmountArray = Object.entries(groupedTaxableAmountData).map(([sgst_percentage, taxableAmountTotal]) => ({
        sgst_percentage,
        taxableAmountTotal,
      }));

      const groupedNetAmountArray = Object.entries(groupedNetAmountData).map(([sgst_percentage, netAmountTotal]) => ({
        sgst_percentage,
        netAmountTotal,
      }));
      // Destructure the sgst Data

      const groupedSgsArray = Object.entries(groupedSgstData).map(([sgst_percentage, sgstTotal]) => ({
        sgst_percentage,
        sgstTotal,
      }));

      // Group the cgst Data
      const groupedCgstData = orderProductArray.reduce((acc, { cgst_percentage, cgst_amount }) => {
        if (!acc[cgst_percentage]) {
          acc[cgst_percentage] = 0;
        }
        acc[cgst_percentage] += Number.GetFloat(cgst_amount);
        return acc;
      }, {});

      // Destructure the cgst Data

      const groupedCgstArray = Object.entries(groupedCgstData).map(([cgst_percentage, cgstTotal]) => ({
        cgst_percentage,
        cgstTotal,
      }));

      // Extract the cgst_percentage and sgst_percentage values into a new array
      const combinedArray = orderProductArray.map((item) => [item.cgst_percentage, item.sgst_percentage]).flat();

      const uniqueNumbers = combinedArray.filter((value) => value !== null);

      // Remove duplicates using a Set amd sort By desc
      const gstList = [...new Set(uniqueNumbers)].sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
      });

      let data = [];

      // Loop the GST list
      for (let i = 0; i < gstList.length; i++) {
        const cGst = groupedCgstArray.find((item) => item.cgst_percentage === gstList[i]);

        const sGst = groupedSgsArray.find((item) => item.sgst_percentage === gstList[i]);
        const netAmount = groupedNetAmountArray.find((item) => item.sgst_percentage === gstList[i]);
        const taxableAmount = groupedTaxableAmountArray.find((item) => item.sgst_percentage === gstList[i]);


        data.push({
          cgstAmount: Math.round(cGst?.cgstTotal) || 0,
          sgstAmount: Math.round(sGst?.sgstTotal) || 0,
          netAmount: Math.round(netAmount?.netAmountTotal) || 0,
          taxableAmount: Math.round(taxableAmount?.taxableAmountTotal) || 0,
          gstPercentage: gstList[i],
          totalAmount:
            Math.round(cGst?.cgstTotal ? cGst?.cgstTotal : 0) + Math.round(sGst?.sgstTotal ? sGst?.sgstTotal : 0) || 0,
        });
      }

      if (showTotal) {
        let lastRecord = ObjectHelper.createEmptyRecord(data[0]);
        lastRecord.cgstAmount = data.reduce((sum, item) => sum + item.cgstAmount, 0) || "";
        lastRecord.sgstAmount = data.reduce((sum, item) => sum + item.sgstAmount, 0) || "";
        lastRecord.netAmount = data.reduce((sum, item) => sum + item.netAmount, 0) || "";
        lastRecord.taxableAmount = data.reduce((sum, item) => sum + item.taxableAmount, 0) || "";
        lastRecord.totalAmount = (lastRecord.cgstAmount + lastRecord.sgstAmount) || "";
        data.push(lastRecord);
      }

      return data;
    } catch (err) {
      console.log(err);
    }
  }

  static async search(req, res) {
    let companyId = Request.GetCompanyId(req);

    try {
      let { page, pageSize, startDate, endDate, pagination, showTotal } = req.query;

      let timeZone = Request.getTimeZone(req);
      let start_date = DateTime.toGetISOStringWithDayStartTime(startDate)
      let end_date = DateTime.toGetISOStringWithDayEndTime(endDate)
      const where = {};

      if (startDate && !endDate) {
        where.order_date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date,timeZone),
          },
        };
      }

      if (endDate && !startDate) {
        where.order_date = {
          [Op.and]: {
            [Op.lte]: DateTime.toGMT(end_date,timeZone),
          },
        };
      }

      if (startDate && endDate) {
        where.order_date = {
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
        attributes: ['id', 'cgst_percentage', 'sgst_percentage', 'sgst_amount', 'cgst_amount', 'order_date',"price","taxable_amount"],
        where,
      };

      // Order Product Query
      const orderProductData = await orderProduct.findAll(query);

      let data = this.getData(orderProductData,showTotal);

      const totalSgstAmount = data.reduce((sum, item) => sum + item.sgstAmount, 0);

      const totalCgstAmount = data.reduce((sum, item) => sum + item.cgstAmount, 0);
      const totalTaxableAmount = data.reduce((sum, item) => sum + item.taxableAmount, 0);
      const totalNetAmount = data.reduce((sum, item) => sum + item.netAmount, 0);

      const totalAmount = totalSgstAmount + totalCgstAmount;

      //return response
      return res.json(200, {
        totalCount: data.length,
        currentPage: page,
        totalAmount,
        totalSgstAmount,
        totalCgstAmount,
        totalTaxableAmount,
        totalNetAmount,
        pageSize,
        data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static getSalesGstData(purchaseProductData) {
    try {
      //  Set Order Product In an Array
      let purchaseProductArray = [];

      let objData = {};

      // Order Product Loop
      for (let i = 0; i < purchaseProductData.length; i++) {
        objData = {
          cgst_percentage: purchaseProductData[i].cgst_percentage,
          sgst_percentage: purchaseProductData[i].sgst_percentage,
          sgst_amount: purchaseProductData[i].sgst_amount,
          cgst_amount: purchaseProductData[i].cgst_amount,
          taxable_amount: purchaseProductData[i].taxable_amount,
          net_amount: purchaseProductData[i].net_amount,
          id: purchaseProductData[i].id,
        };
        purchaseProductArray.push(objData);
      }

      // Group the sgst Data
      const groupedSgstData = purchaseProductArray.reduce((acc, { sgst_percentage, sgst_amount }) => {
        if (!acc[sgst_percentage]) {
          acc[sgst_percentage] = 0;
        }
        acc[sgst_percentage] += Number.GetFloat(sgst_amount);
        return acc;
      }, {});

      // Destructure the sgst Data

      const groupedSgsArray = Object.entries(groupedSgstData).map(([sgst_percentage, sgstTotal]) => ({
        sgst_percentage,
        sgstTotal,
      }));

      // Group the cgst Data
      const groupedCgstData = purchaseProductArray.reduce((acc, { cgst_percentage, cgst_amount }) => {
        if (!acc[cgst_percentage]) {
          acc[cgst_percentage] = 0;
        }
        acc[cgst_percentage] += Number.GetFloat(cgst_amount);
        return acc;
      }, {});

      // Group the cgst Data
      const groupedTaxableData = purchaseProductArray.reduce((acc, { cgst_percentage, taxable_amount }) => {
        if (!acc[cgst_percentage]) {
          acc[cgst_percentage] = 0;
        }
        acc[cgst_percentage] += Number.GetFloat(taxable_amount);
        return acc;
      }, {});

   
      
      const groupedTaxableArray = Object.entries(groupedTaxableData).map(([cgst_percentage, taxableTotal]) => ({
        cgst_percentage,
        taxableTotal,
      }));
     

       // Group the cgst Data
       const groupedNetData = purchaseProductArray.reduce((acc, { cgst_percentage, net_amount }) => {
        if (!acc[cgst_percentage]) {
          acc[cgst_percentage] = 0;
        }
        acc[cgst_percentage] += Number.GetFloat(net_amount);
        return acc;
      }, {});

         // Destructure the cgst Data

         const groupednetAmountArray = Object.entries(groupedNetData).map(([cgst_percentage, netAmountTotal]) => ({
          cgst_percentage,
          netAmountTotal,
        }));
      // Destructure the cgst Data

      const groupedCgstArray = Object.entries(groupedCgstData).map(([cgst_percentage, cgstTotal]) => ({
        cgst_percentage,
        cgstTotal,
      }));

      // Extract the cgst_percentage and sgst_percentage values into a new array
      const combinedArray = purchaseProductArray.map((item) => [item.cgst_percentage, item.sgst_percentage]).flat();

      const uniqueNumbers = combinedArray.filter((value) => value !== null);

      // Remove duplicates using a Set amd sort By desc
      const gstList = [...new Set(uniqueNumbers)].sort((a, b) => {
        return parseFloat(a) - parseFloat(b);
      });

      let data = [];

      // Loop the GST list
      for (let i = 0; i < gstList.length; i++) {
        const cGst = groupedCgstArray.find((item) => item.cgst_percentage === gstList[i]);

        const sGst = groupedSgsArray.find((item) => item.sgst_percentage === gstList[i]);

        const netAmount = groupednetAmountArray.find((item) => item.cgst_percentage === gstList[i]);

        const taxableAmount = groupedTaxableArray.find((item) => item.cgst_percentage === gstList[i]);

        data.push({
          cgstAmount: Math.round(cGst?.cgstTotal) || 0,
          sgstAmount: Math.round(sGst?.sgstTotal) || 0,
          netAmount:Math.round(netAmount?.netAmountTotal) || 0,
          taxableAmount:Math.round(taxableAmount?.taxableTotal) || 0,
          gstPercentage: gstList[i],
          totalAmount:
            Math.round(cGst?.cgstTotal ? cGst?.cgstTotal : 0) + Math.round(sGst?.sgstTotal ? sGst?.sgstTotal : 0) || 0,
        });
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = GstService;
