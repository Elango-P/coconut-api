const { Location,order, Shift, User } = require("../db").models;

// Util

const location = require("../helpers/Location");
const DateTime = require("../lib/dateTime");
const DataBaseService = require("../lib/dataBaseService");
const LocationService = new DataBaseService(Location);

const OrderProductConstants = require("../helpers/OrderProduct");
const { BAD_REQUEST, OK } = require("../helpers/Response");
const Boolean = require("../lib/Boolean");
const validator = require("../lib/validator");
const { Op, Sequelize } = require("sequelize");
const Order = require("../helpers/Order");
const Number = require("../lib/Number");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const Request = require("../lib/request");
const StatusService = require("./StatusService");
const ObjectName = require("../helpers/ObjectName");
const Currency = require("../lib/currency");

const getCountAndTotalAmount = (orderArray, storeId) => {
  let count = 0;
  let totalAmount = 0;

  for (const order of orderArray.rows) {
    if (order.store_id == storeId && order.total_amount !== null) {
      count++;
      totalAmount += Number.Get(order?.total_amount);
    }
  }

  return { count, totalAmount };
};

const searchStore = async (params, companyId, orderList) => {
  try {
    let where = {};
    where.company_id = companyId;
    where.status = location.STATUS_ACTIVE;
    where.allow_sale = location.ENABLED;

    const query = {
      where,
      order: [["sort_order", "ASC"]],
      attributes: ["id", "name", "status", "allow_sale", "company_id"],
    };

    // Get Location list and count

    const locationData = [];

    if (params.type == OrderProductConstants.REPORT_TYPE_LOCATION_WISE || params.type == "") {
      const locationDetails = await LocationService.find(query);

      let data;
      for (let storeDetail of locationDetails) {
        let orderData = getCountAndTotalAmount(orderList, storeDetail.id);

        data = {
          id: storeDetail.id,
          name: storeDetail.name,
          status: storeDetail.status,
          totalAmount: orderData.totalAmount,
          totalCount: orderData.count,
        };

          locationData.push(data);
      }
      return {
        totalCount: locationDetails.length,
        data: locationData,
      };
    }
  } catch (err) {
    console.log(err);
  }
};

const getDataBasedOnType = async (type, orderDetails, sortType) => {
  try {
    if (type === OrderProductConstants.REPORT_TYPE_MONTH_WISE) {
      try {
        const aggregatedData = new Map();

        for (const value of orderDetails.rows) {
          const date = new Date(value.date);
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // Months are zero-based, so add 1
          const yearMonth = `${month < 10 ? "0" : ""}${month} ${String(year).slice(-2)}`;
          const amount = Number.Get(value.total_amount);

          // Initialize the data entry if it doesn"t exist in the map
          if (!aggregatedData.has(yearMonth)) {
            aggregatedData.set(yearMonth, {
              date: yearMonth,
              amount: 0,
              totalCount: 0,
            });
          }

          // Update the existing data entry
          const entry = aggregatedData.get(yearMonth);
          entry.amount += amount;
          entry.totalCount++;
        }

        // Convert the Map values to an array
        const orderData = Array.from(aggregatedData.values());


        return orderData;
      } catch (err) {
        console.log(err);
      }
    } else if (type === OrderProductConstants.REPORT_TYPE_DATE_WISE) {
      const orderData = [];

      for (const value of orderDetails.rows) {
        const date = DateTime.Format(value.date);
        const amount = Number.Get(value.get("total_amount"));

        const existingItem = orderData.find((item) => item.date === date);
        if (existingItem) {
          existingItem.amount += amount;
          existingItem.totalCount += 1;
        } else {
          orderData.push({
            date: date,
            amount: amount,
            totalCount: 1,
          });
        }
      }

      return orderData;
    }
  } catch (err) {
    console.error(err);
  }
};

const getReport = async (params, res) => {
  let { page, pageSize, search, sort, sortDir, pagination, user, startDate, endDate, location, shift, type, paymentType, group, status, orderType, companyId, timeZone } = params;
  let date = DateTime.getCustomDateTime(params?.date, timeZone)

  // Validate if page is not a number
  page = page ? parseInt(page, 10) : 1;
  if (isNaN(page)) {
    return res.json(BAD_REQUEST, { message: "Invalid page" });
  }

  // Validate if page size is not a number
  pageSize = pageSize ? parseInt(pageSize, 10) : 25;
  if (isNaN(pageSize)) {
    return res.json(BAD_REQUEST, { message: "Invalid page size" });
  }


  if (!companyId) {
    return res.json(400, "Company Not Found");
  }

  // Sortable Fields
  const validOrder = ["ASC", "DESC"];
  const sortableFields = {
    id: "id",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    location: "location",
    shift: "shift",
    date: "date",
    total_amount: "total_amount",
    cash_amount: "cash_amount",
    upi_amount: "upi_amount",
    owner:"owner",
    payment_type: "payment_type"
  };

  const sortParam = sort || "total_amount";

  // Validate sortable fields is present in sort param
  if (!Object.keys(sortableFields).includes(sortParam)) {
    return res.json(BAD_REQUEST, { message: `Unable to sort payments by ${sortParam}` });
  }

  const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
  // Validate order is present in sortDir param
  if (!validOrder.includes(sortDirParam)) {
    return res.json(BAD_REQUEST, { message: "Invalid sort order" });
  }
  let start_date = DateTime.toGetISOStringWithDayStartTime(startDate)
  let end_date = DateTime.toGetISOStringWithDayEndTime(endDate)

  const where = {};
  where.company_id = companyId;

  if (user) {
    where.owner = user;
  }

  if (location) {
    where.store_id = location;
  }

  if (shift) {
    where.shift = shift;
  }

  if (Number.isNotNull(orderType)) {
    where.type = orderType;
  }

  if (Number.isNotNull(group) || Number.isNotNull(status)) {
    let statusDetail = await StatusService.getAllStatusByGroupId(ObjectName.ORDER_TYPE, group, companyId);
    const statusIdsArray = statusDetail && statusDetail.length > 0 && statusDetail.map(status => status.id) || [];
    if (statusIdsArray && statusIdsArray.length > 0 || Number.isNotNull(status)) {
      let statusValue = Number.isNotNull(status) ? [status] :[]
      where.status = {
        [Op.in]: [...statusIdsArray, ...statusValue]
      }
    } else {
      where.status = null
    }
  }

  if (Number.isNotNull(paymentType)) {
    where.payment_type = paymentType;
  }
  const searchTerm = search ? search.trim() : null;
  if (searchTerm) {
    where[Op.or] = [
      {
        "$location.name$": {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
    ];
  }

  if (startDate && !endDate) {
    where.date = {
      [Op.and]: {
        [Op.gte]:DateTime.toGMT(start_date,timeZone)
      },
    };
  }

  if (endDate && !startDate) {
    where.date = {
      [Op.and]: {
        [Op.lte]: DateTime.toGMT(end_date,timeZone),
      },
    };
  }

  if (startDate && endDate) {
    where.date = {
      [Op.and]: {
        [Op.gte]: DateTime.toGMT(start_date,timeZone),
        [Op.lte]: DateTime.toGMT(end_date,timeZone),
      },
    };
  }

  if (date && Number.isNotNull(params?.date)) {
    where.date = {
      [Op.and]: {
        [Op.gte]: date?.startDate,
        [Op.lte]: date?.endDate,
      },
    };
  }

  let sortNullsLast = sortDirParam == "DESC" ? "NULLS LAST" : "NULLS FIRST";

  let sortOrder = [];
  
  if (sortParam == "location") {
    sortOrder.push([Sequelize.fn("max", Sequelize.col("location.name")), sortDirParam, sortNullsLast]);
  }
  
  if (sortParam == "shift") {
    sortOrder.push([{ model: Shift, as: "shiftDetail" }, "name", sortDirParam]);
  }
  
  if (sortParam == "owner") {
    sortOrder.push([{ model: User, as: "ownerDetail" }, "name", sortDirParam]);
  }
  
  if (sortParam == "date") {
    sortOrder.push([Sequelize.fn("max", Sequelize.col("order.date")), sortDirParam, sortNullsLast]);
  }
  
  if (sortParam == "total_amount") {
    sortOrder.push([Sequelize.fn("SUM", Sequelize.col("order.total_amount")), sortDirParam, sortNullsLast]);
  }

  if (sortParam == "cash_amount") {
    sortOrder.push([Sequelize.fn("SUM", Sequelize.col("order.cash_amount")), sortDirParam, sortNullsLast]);
  }

  if (sortParam == "upi_amount") {
    sortOrder.push([Sequelize.fn("SUM", Sequelize.col("order.upi_amount")), sortDirParam, sortNullsLast]);
  }

  if (sortParam == "payment_type") {
    sortOrder.push([Sequelize.fn("max", Sequelize.col("order.payment_type")), sortDirParam, sortNullsLast]);
  }
  
  
  const query = {
    include: [],
    order: sortOrder,
    where,
    attributes: [
      [Sequelize.fn("max", Sequelize.col("order.date")), "date"],
      [Sequelize.fn("SUM", Sequelize.col("order.total_amount")), "total_amount"], 
      [Sequelize.fn("SUM", Sequelize.col("order.cash_amount")), "cash_amount"], 
      [Sequelize.fn("SUM", Sequelize.col("order.upi_amount")), "upi_amount"], 
      [Sequelize.fn("COUNT", Sequelize.col("order.id")), "order_count"],
    ],
    group: [], 
  };

  if(type == "Location Wise"){
    query.attributes.push(
      [Sequelize.fn("max", Sequelize.col("location.name")), "locationName"] 
    )

    query.include.push({
      required: false,
      model: Location,
      as: "location",
      attributes: ["id", "name"],
    })

    query.group.push("location.id")
  }


  if(type == "User Wise"){
 

    query.include.push( {
      model: User,
      as: "ownerDetail",
      attributes: ["id", "name", "last_name", "media_url"],
    })

    query.group.push("ownerDetail.id")
  }

  if(Number.isNotNull(paymentType)){
    query.attributes.push(
      [Sequelize.fn("max", Sequelize.col("order.payment_type")), "payment_type"]
    )
  }

  if(!type && !paymentType){

    query.attributes.push(
      [Sequelize.fn("max", Sequelize.col("location.name")), "locationName"],
      [Sequelize.fn("max", Sequelize.col("order.payment_type")), "payment_type"],
    )

    query.include.push({
      required: false,
      model: Location,
      as: "location",
      attributes: ["id", "name"],
    },{
      required: false,
      model: Shift,
      as: "shiftDetail",
      attributes: ["name"],
    },{
      model: User,
      as: "ownerDetail",
      attributes: ["id", "name", "last_name", "media_url"],
    })

    query.group.push("location.id","ownerDetail.id","shiftDetail.id")
  }

  if (validator.isEmpty(pagination)) {
    pagination = true;
  }
  if (Boolean.isTrue(pagination)) {
    if (pageSize > 0) {
      query.limit = pageSize;
      query.offset = (page - 1) * pageSize;
    }
  }
  try {
    const orderList = await order.findAndCountAll(query);
    let orderData = orderList && orderList.rows;
    const data = [];
    if (orderData && orderData.length > 0) {
      for (let i = 0; i < orderData.length; i++) {
        const { id, date, ownerDetail, dataValues, total_amount, shiftDetail, type, cash_amount, upi_amount, payment_type } = orderData[i];
        data.push({
          id,
          date : DateTime.getDateByUserProfileTimezone(date,timeZone,"DD-MMM-YYYY"),
          location: dataValues?.locationName,
          shift: shiftDetail && shiftDetail?.name,
          total_amount,
          firstName: ownerDetail && ownerDetail?.name,
          lastName: ownerDetail && ownerDetail?.last_name,
          image_url: ownerDetail && ownerDetail?.media_url,
          type: type,
          cash_amount: cash_amount ?? "",
          upi_amount: upi_amount ?? "",
          paymentType : payment_type == null ? "" : payment_type ==  Order.PAYMENT_TYPE_UPI_VALUE ? Order.PAYMENT_TYPE_UPI_TEXT : payment_type == Order.PAYMENT_TYPE_CASH_VALUE ? Order.PAYMENT_TYPE_CASH_TEXT: payment_type == Order.PAYMENT_TYPE_MIXED_VALUE ?  Order.PAYMENT_TYPE_MIXED_TEXT :"",
          order_count: dataValues?.order_count,
          email_cash_amount: cash_amount ? Currency.IndianFormat(cash_amount) :"",
          email_upi_amount: upi_amount ? Currency.IndianFormat(upi_amount): "",
          email_total_amount: Currency.IndianFormat(total_amount),
        });
      }
    }
   return {
    totalCount: orderList && orderList?.count && orderList?.count?.length,
    currentPage: page,
    pageSize,
    data,
    search,
    sort,
    sortDir,
  }
  } catch (err) {
    console.log(err);
    res.json(OK, { message: err.message });
  }
};

module.exports = {
  searchStore,
  getDataBasedOnType,
  getReport
};
