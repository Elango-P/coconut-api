const { Op, Sequelize, fn, col } = require("sequelize");
const { ACTIVE, STATUS_ACTIVE } = require("../helpers/Location");
const DateTime = require("../lib/dateTime");

const {
  SaleSettlement,
  Location,
  User,
  Shift,
  status: statusModel,
  order: orderModel,
} = require("../db").models;
const DataBaseService = require("../lib/dataBaseService");
const SaleSettlementService = new DataBaseService(SaleSettlement);

const Request = require("../lib/request");
const StatusService = require("../services/StatusService");
const ObjectName = require("../helpers/ObjectName");
const Status = require("../helpers/Status");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const Number = require("../lib/Number");
const saleSettlement = require("../helpers/SaleSettlement");
const ArrayList = require("../lib/ArrayList");

const search = async (req, res) => {
  let companyId = Request.GetCompanyId(req);

  try {
    let {
      page,
      pageSize,
      search,
      sort,
      sortDir,
      location,
      user,
      shift,
      startDate,
      endDate,
      type,
      pagination,
    } = req.query;

    let timeZone = Request.getTimeZone(req)

    let date = DateTime.getCustomDateTime(req.query?.date, timeZone)

    const where = {};

    // Apply filters if there is one
    if (location && parseInt(location)) {
      where.store_id = Number.Get(location);
    }

    if (shift) {
      where.shift = shift;
    }

    if (user) {
      where.sales_executive = user;
    }

    

    if (startDate && !endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }

    if (endDate && !startDate) {
      where.date = {
        [Op.and]: {
          [Op.lte]: endDate,
        },
      };
    }

    if (startDate && endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };
    }

    if (date && Number.isNotNull(req.query?.date)) {
      where.date = {
        [Op.and]: {
          [Op.gte]: date?.startDate,
          [Op.lte]: date?.endDate,
        },
      };
    }

    where.company_id = companyId;

    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(400, {
        message: "Invalid page",
      });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(400, {
        message: "Invalid page size",
      });
    }

    if (page && pageSize) {
      // Validate if page is not a number
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.json(400, {
          message: "Invalid page",
        });
      }

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.json(400, {
          message: "Invalid page size",
        });
      }
    }
    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      date: "date",
      shift: "shift",
      createdAt: "createdAt",
      sale_settlement_number: "sale_settlement_number",
      location: "location",
    };
    let sortData = "";
    let sortValue = "";

    if (sort !== "discrepancy_cash" && sort !== "discrepancy_upi") {
      sortValue = sort;
    }else{
      sortData = sort;
    }
    const sortParam =  sortValue || "sale_settlement_number";

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(400, {
        message: `Unable to sort data by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(400, {
        message: "Invalid sort order",
      });
    }

    page = page ? parseInt(page, 10) : 1;

    pageSize = pageSize ? parseInt(pageSize, 10) : 25;

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          "$location.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        Sequelize.where(
          fn(
            "concat",
            col("salesExecutive.name"),
            " ",
            col("salesExecutive.last_name")
          ),
          {
            [Op.iLike]: `%${searchTerm}%`,
          }
        ),
        {
          "$shiftDetail.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }
    where[Op.or] = [
      {
        discrepancy_amount_upi: {
          [Op.ne]: null, 
          [Op.ne]: 0,
        },
      },
      {
        discrepancy_amount_cash: {
          [Op.ne]: null, 
          [Op.ne]: 0,
        },
      },
    ];

    let order = [];
    if (sortParam === "shift") {
      order.push([[{ model: Shift, as: "shiftDetail" }, "name", sortDirParam]]);
    }
    if (sortParam === "location") {
      order.push([{ model: Location, as: "location" }, "name", sortDirParam]);
    } else {
      order.push([[sortParam, sortDirParam]]);
    }

    const include = [
      {
        required: false,
        model: Location,
        as: "location",
        attributes: ["id", "name"],
      },
      {
        required: false,
        model: Shift,
        as: "shiftDetail",
        attributes: ["id", "name"],
      },
      {
        required: false,
        model: User,
        as: "salesExecutive",
      },
    ];
    const query = {
      order,
      where,
      include,
    };

    let SalesData = new Array();

    let salesSettlementTempData;

    let salesSettlementCount = await SaleSettlement.count(query);

    if (salesSettlementCount > 100) {
      let pageLength = salesSettlementCount / 100;

      pageLength = Math.ceil(pageLength);

      for (let i = 1; i <= pageLength; i++) {
        query.limit = 100;

        query.offset = (i - 1) * 100;

        salesSettlementTempData = await SaleSettlementService.find(query);

        for (let j = 0; j < salesSettlementTempData.length; j++) {
          SalesData.push(salesSettlementTempData[j]);
        }
      }
    } else {
      SalesData = await SaleSettlementService.find(query);
    }

    let data = [];
    let draftOrderAmount = 0;
    let saleOrderData = {};
    let orderWhere = {};

    let draftOrderStatus = await StatusService.Get(
      ObjectName.ORDER_TYPE,
      Status.GROUP_DRAFT,
      companyId
    );

    if (SalesData.length > 0) {
      for (let i = 0; i < SalesData.length; i++) {
        let { location, salesExecutive, shiftDetail } = SalesData[i];
    
        orderWhere.owner = salesExecutive.id;
        orderWhere.shift = shiftDetail.id;
        orderWhere.store_id = location.id;
        orderWhere.status = draftOrderStatus?.id;
        
        let start_date = DateTime.toGetISOStringWithDayStartTime(
          SalesData[i].date
        );
        let end_date = DateTime.toGetISOStringWithDayEndTime(SalesData[i].date);
        orderWhere.date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date, timeZone),
            [Op.lte]: DateTime.toGMT(end_date, timeZone),
          },
        };

        draftOrderAmount = await orderModel.sum("total_amount", {
          where: orderWhere,
        });
        let totalDiscrepancyCash =
        Number.GetFloat(SalesData[i].amount_cash) -
        Number.GetFloat(SalesData[i].order_cash_amount);
        let totalDiscrepancyUpi =
          Number.GetFloat(SalesData[i].amount_upi) -
          Number.GetFloat(SalesData[i].order_upi_amount);

        if (type == saleSettlement.TYPE_POSITIVE) {
          if (totalDiscrepancyCash > 0 && totalDiscrepancyUpi > 0) {
            let  saleOrderData = {
              location: location.name,
              name: salesExecutive.name,
              last_name: salesExecutive.last_name,
              shift: shiftDetail.name,
              date: DateTime.Format(SalesData[i].date),
              draftOrderAmount : Number.GetCurrency(draftOrderAmount),
              totalOrderCash:
                Number.GetFloat(SalesData[i].order_cash_amount) +
                Number.GetFloat(draftOrderAmount),
              totalOrderUpi: Number.GetFloat(SalesData[i].order_upi_amount),
              totalSaleCash: Number.GetFloat(SalesData[i].amount_cash),
              totalSaleUpi: Number.GetFloat(SalesData[i].amount_upi),
              discrepancy_cash: Number.GetFloat(totalDiscrepancyCash),
              discrepancy_upi: Number.GetFloat(totalDiscrepancyUpi),
              image: salesExecutive.media_url,
              id :SalesData[i].id,
              saleSettlementNumber:SalesData[i].sale_settlement_number
            };
              data.push(saleOrderData);

          }
          if (totalDiscrepancyCash < 0 && totalDiscrepancyUpi >= 0) {
            let  saleOrderData = {
              location: location.name,
              name: salesExecutive.name,
              last_name: salesExecutive.last_name,
              shift: shiftDetail.name,
              date: DateTime.Format(SalesData[i].date),
              draftOrderAmount : Number.GetCurrency(draftOrderAmount),
              totalOrderCash: null,
              totalOrderUpi: Number.GetFloat(SalesData[i].order_upi_amount),
              totalSaleCash: null,
              totalSaleUpi: Number.GetFloat(SalesData[i].amount_upi),
              discrepancy_cash: null,
              discrepancy_upi: Number.GetFloat(totalDiscrepancyUpi),
              image: salesExecutive.media_url,
              id :SalesData[i].id,
              saleSettlementNumber:SalesData[i].sale_settlement_number
            };
        data.push(saleOrderData);

          }
          if (totalDiscrepancyCash >= 0 && totalDiscrepancyUpi < 0) {
            let  saleOrderData = {
              location: location.name,
              name: salesExecutive.name,
              last_name: salesExecutive.last_name,
              shift: shiftDetail.name,
              date: DateTime.Format(SalesData[i].date),
              draftOrderAmount : Number.GetCurrency(draftOrderAmount),
              totalOrderCash:
                Number.GetFloat(SalesData[i].order_cash_amount) +
                Number.GetFloat(draftOrderAmount),
              totalOrderUpi: null,
              totalSaleCash: Number.GetFloat(SalesData[i].amount_cash),
              totalSaleUpi: null,
              discrepancy_cash: Number.GetFloat(totalDiscrepancyCash),
              discrepancy_upi: null,
              image: salesExecutive.media_url,
              id :SalesData[i].id,
              saleSettlementNumber:SalesData[i].sale_settlement_number
            };
            data.push(saleOrderData);
          }

        }

        if (type == saleSettlement.TYPE_NEGATIVE) {
          if (totalDiscrepancyCash < 0 && totalDiscrepancyUpi < 0) {
           
            let saleOrderData = {
              location: location.name,
              name: salesExecutive.name,
              last_name: salesExecutive.last_name,
              shift: shiftDetail.name,
              date: DateTime.Format(SalesData[i].date),
              totalOrderCash:
                Number.GetFloat(SalesData[i].order_cash_amount) +
                Number.GetFloat(draftOrderAmount),
              totalOrderUpi: Number.GetFloat(SalesData[i].order_upi_amount),
              totalSaleCash: Number.GetFloat(SalesData[i].amount_cash),
              totalSaleUpi: Number.GetFloat(SalesData[i].amount_upi),
              discrepancy_cash: Number.GetFloat(totalDiscrepancyCash),
              discrepancy_upi: Number.GetFloat(totalDiscrepancyUpi),
              image: salesExecutive.media_url,
              id :SalesData[i].id,
              saleSettlementNumber:SalesData[i].sale_settlement_number
            };

            data.push(saleOrderData);
          }
          if (totalDiscrepancyCash < 0 && totalDiscrepancyUpi >= 0) {
           
            let saleOrderData = {
              location: location.name,
              name: salesExecutive.name,
              last_name: salesExecutive.last_name,
              shift: shiftDetail.name,
              date: DateTime.Format(SalesData[i].date),
              draftOrderAmount : Number.GetCurrency(draftOrderAmount),
              totalOrderCash:
                Number.GetFloat(SalesData[i].order_cash_amount) +
                Number.GetFloat(draftOrderAmount),
              totalOrderUpi:null,
              totalSaleCash: Number.GetFloat(SalesData[i].amount_cash),
              totalSaleUpi: null,
              discrepancy_cash: Number.GetFloat(totalDiscrepancyCash),
              discrepancy_upi: null,
              image: salesExecutive.media_url,
              id :SalesData[i].id,
              saleSettlementNumber:SalesData[i].sale_settlement_number
            };
            data.push(saleOrderData);
          }
          if (totalDiscrepancyCash >= 0 && totalDiscrepancyUpi < 0) {
           
            let saleOrderData = {
              location: location.name,
              name: salesExecutive.name,
              last_name: salesExecutive.last_name,
              shift: shiftDetail.name,
              date: DateTime.Format(SalesData[i].date),
              draftOrderAmount : Number.GetCurrency(draftOrderAmount),
              totalOrderCash: null,
              totalOrderUpi: Number.GetFloat(SalesData[i].order_upi_amount),
              totalSaleCash: null,
              totalSaleUpi: Number.GetFloat(SalesData[i].amount_upi),
              discrepancy_cash: null,
              discrepancy_upi: Number.GetFloat(totalDiscrepancyUpi),
              image: salesExecutive.media_url,
              id :SalesData[i].id,
              saleSettlementNumber:SalesData[i].sale_settlement_number
            };
            data.push(saleOrderData);
          }
        

        }

        if (type == saleSettlement.TYPE_ALL || !type) {
          let  saleOrderData = {
            location: location.name,
            name: salesExecutive.name,
            last_name: salesExecutive.last_name,
            shift: shiftDetail.name,
            date: DateTime.Format(SalesData[i].date),
            draftOrderAmount : Number.GetCurrency(draftOrderAmount),
            totalOrderCash:
              Number.GetFloat(SalesData[i].order_cash_amount) +
              Number.GetFloat(draftOrderAmount),
            totalOrderUpi: Number.GetFloat(SalesData[i].order_upi_amount),
            totalSaleCash: Number.GetFloat(SalesData[i].amount_cash),
            totalSaleUpi: Number.GetFloat(SalesData[i].amount_upi),
            discrepancy_cash: Number.GetFloat(totalDiscrepancyCash),
            discrepancy_upi: Number.GetFloat(totalDiscrepancyUpi),
            image: salesExecutive.media_url,
            id :SalesData[i].id,
            saleSettlementNumber:SalesData[i].sale_settlement_number
          };
        data.push(saleOrderData);

        }
      }
    }
    const offset = (page - 1) * pageSize;

    const saleSettlementData = data.slice(offset, offset + pageSize);

    let sortedData = ArrayList.sort(saleSettlementData,sortData,sortDirParam)
    //return response
    return res.json(200, {
      totalCount: data.length,
      currentPage: page,
      pageSize,
      data: sortedData,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  search,
};
