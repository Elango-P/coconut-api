const { Location, orderProduct } = require("../db").models;
const Currency = require("../lib/currency");
// Util
const { shortDateAndTime } = require("../lib/dateTime");

const location = require("../helpers/Location");
const DateTime = require("../lib/dateTime");
const DataBaseService = require("../lib/dataBaseService");
const LocationService = new DataBaseService(Location);
const orderProductService = new DataBaseService(orderProduct);
const { Op } = require("sequelize");
const OrderProductConstants = require("../helpers/OrderProduct");
const Number = require("../lib/Number");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const Request = require("../lib/request");

const orderSearch = async (params, companyId) => {
  try {
    let { startDate, endDate, product } = params;

    let timeZone = Request.getTimeZone(req);
    let start_date = DateTime.toGetISOStringWithDayStartTime(startDate)
    let end_date = DateTime.toGetISOStringWithDayEndTime(endDate)
    // Validate if page is not a number

    const query = {
      where: { company_id: companyId, status: location.STATUS_ACTIVE },
      order: [["name", "ASC"]],
      attribute: ["name", "id", "status"],
    };

    // Get Location list and count
    const locationDetails = await LocationService.findAndCount(query);
    const locationData = [];

    for (let storeDetail of locationDetails.rows) {
      const { id, name, status } = storeDetail;

      let orderProductWhere = {};
      if (startDate && !endDate) {
        orderProductWhere.order_date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date,timeZone),
          },
        };
      }

      if (endDate && !startDate) {
        orderProductWhere.order_date = {
          [Op.and]: {
            [Op.lte]: DateTime.toGMT(end_date,timeZone),
          },
        };
      }

      if (startDate && endDate) {
        orderProductWhere.order_date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date,timeZone),
            [Op.lte]: DateTime.toGMT(end_date,timeZone),
          },
        };
      }

      orderProductWhere.store_id = id;
      orderProductWhere.company_id = companyId;
      if (product) {
        orderProductWhere.product_id = product;
      }

      const orderDetails = await orderProductService.findAndCount({
        where: orderProductWhere,
      });

      let totalQuantity = 0;

      for (let data of orderDetails.rows) {
        let orderProductData = {
          ...data.get(),
        };

        totalQuantity = totalQuantity + Number.Get(orderProductData.quantity);
      }
      const data = {
        id,
        name,
        status,
        quantity: totalQuantity,
      };
      // formatDatee object property
      locationData.push(data);
    }
    return {
      totalCount: locationDetails.count,
      data: locationData,
    };
  } catch (err) {
    console.log(err);
  }
};

const getDataByType = async (type, orderDetails,sort,sortDir, dateArray) => {
  let orderData = [];

  const dateSet = new Set(dateArray);

  const matchedDates = new Map();

  if (type == OrderProductConstants.REPORT_TYPE_MONTH_WISE) {
    await orderDetails.forEach(async (value) => {
      let date = DateTime.Format(value.order_date);

      let year = DateTime.getYear(value.order_date);
      year = String(year).slice(-2);

      if (dateSet.has(date)) {
        orderData.push({
          date: DateTime.getMonth(date) + " " + year,
          quantity: Number.Get(value.get("quantity")),
          price: Number.Get(value.get("price")),
        });
        matchedDates.set(date, true);
      }
    });

    dateArray.forEach((date) => {
      let year = DateTime.getYear(date);
      year = String(year).slice(-2);
      if (!matchedDates.has(date)) {
        orderData.push({ date: DateTime.getMonth(date) + " " + year, quantity: 0, price: 0 });
      }
    });
    orderData = await orderData.reduce((obj, item) => {
      let find = obj.find((i) => i.date === item.date);
      let _d = {
        ...item,
      };
      if (find) {
        find.quantity += item.quantity;
        find.price += item.price;
      } else {
        obj.push(_d);
      }
      return obj;
    }, []);
    return orderData;
  } else if (type == OrderProductConstants.REPORT_TYPE_DATE_WISE) {
    let data = [];
    const dateSet = new Set(dateArray);
    const matchedDates = new Map();
    orderDetails.forEach((value) => {
      let date = DateTime.Format(value.order_date);
      let quantity = Number.Get(value.get("quantity"));
      let price = Number.Get(value.get("price"));
      if (dateSet.has(date)) {
        data.push({
          date: date,
          quantity: quantity,
          price: price,
        });
        matchedDates.set(date, true);
      }
    });

    dateArray.forEach((date) => {
      if (!matchedDates.has(date)) {
        data.push({ date: DateTime.Format(date), quantity: 0, price: 0 });
      }
    });
    let groupData = await data.reduce((obj, item) => {
      let find = obj.find((i) => i.date == item.date);
      let _d = {
        ...item,
      };
      if (find) {
        find.quantity += item.quantity;
        find.price += item.price;
      } else {
        obj.push(_d);
      }
      return obj;
    }, []);

    groupData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return groupData;
  } else if (type == OrderProductConstants.REPORT_TYPE_LOCATION_WISE) {
    let orderData = [];
    orderDetails.forEach((value) => {
      let name = value.locationDetails.name;
      let data = {
        name: name,
        location_id: value?.locationDetails?.id,
        quantity: Number.Get(value.get("quantity")),
        price: Number.Get(value.get("price")),
      };
      orderData.push(data);
    });

    const groupedDataMap = new Map();

    orderData.forEach((item) => {
      const { location_id, name, quantity, price } = item;

      if (groupedDataMap.has(location_id)) {
        const existingData = groupedDataMap.get(location_id);
        existingData.quantity += quantity;
        existingData.price += price;
      } else {
        groupedDataMap.set(location_id, { location_id, name, quantity, price });
      }
    });

    const groupedDataArray = Array.from(groupedDataMap.values());
    if(groupedDataArray && groupedDataArray.length >0){
      if(sort=="name"){
        groupedDataArray.sort((a, b) => a?.name?.localeCompare(b?.name));
      }

      if(sort=="quantity"){
        groupedDataArray.sort((a, b) => b?.quantity - a?.quantity);
      }
      
      if(sort=="amount"){
        groupedDataArray.sort((a, b) => b?.price - a?.price);
      }
    }
    return groupedDataArray;
  } else if (type == OrderProductConstants.REPORT_TYPE_BRAND_WISE) {
    let data = [];
    for (let i = 0; i < orderDetails?.length; i++) {
      const { quantity, productIndex, price } = orderDetails?.[i];
      data.push({
        brand_id: productIndex?.brand_id,
        brand_name: productIndex?.brand_name,
        quantity: quantity,
        price: Number.Get(price),
      });
    }

    const groupedDataMap = new Map();
    data.forEach((item) => {
      const { brand_id, brand_name, quantity, price } = item;

      if (groupedDataMap.has(brand_id)) {
        const existingData = groupedDataMap.get(brand_id);
        existingData.quantity += quantity;
        existingData.price += price;
      } else {
        groupedDataMap.set(brand_id, { brand_id, brand_name, quantity, price });
      }
    });
    const groupedDataArray = Array.from(groupedDataMap.values());
    if(groupedDataArray && groupedDataArray.length >0){
      if(sort=="name"){
        groupedDataArray.sort((a, b) => a?.brand_name?.localeCompare(b?.brand_name));
      }

      if(sort=="quantity"){
        groupedDataArray.sort((a, b) => b?.quantity - a?.quantity);
      }
      
      if(sort=="amount"){
        groupedDataArray.sort((a, b) => b?.price - a?.price);
      }
    }

    return groupedDataArray;
  } else if (type == OrderProductConstants.REPORT_TYPE_PRODUCT_WISE) {
    let data = [];
    for (let i = 0; i < orderDetails?.length; i++) {
      const { quantity, productIndex, price } = orderDetails?.[i];
      data.push({
        product_id: productIndex?.product_id,
        product_name: productIndex?.product_name,
        quantity: quantity,
        price: Number.Get(price),
      });
    }

    const groupedDataMap = new Map();
    data.forEach((item) => {
      const { product_id, product_name, quantity, price } = item;

      if (groupedDataMap.has(product_id)) {
        const existingData = groupedDataMap.get(product_id);
        existingData.quantity += quantity;
        existingData.price += price;
      } else {
        groupedDataMap.set(product_id, { product_id, product_name, quantity, price });
      }
    });
    const groupedDataArray = Array.from(groupedDataMap.values());
    if(groupedDataArray && groupedDataArray.length >0){
      if(sort=="name"){
        groupedDataArray.sort((a, b) => a?.product_name?.localeCompare(b?.product_name));
      }

      if(sort=="quantity"){
        groupedDataArray.sort((a, b) => b?.quantity - a?.quantity);
      }
      
      if(sort=="amount"){
        groupedDataArray.sort((a, b) => b?.price - a?.price);
      }
    }

    return groupedDataArray;
  }else if (type == OrderProductConstants.REPORT_TYPE_CATEGORY_WISE) {
    let data = [];
    for (let i = 0; i < orderDetails?.length; i++) {
      const { quantity, productIndex, price } = orderDetails?.[i];
      data.push({
        category_id: productIndex?.category_id,
        category_name: productIndex?.category_name,
        quantity: quantity,
        price: Number.Get(price),
      });
    }
    const groupedDataMap = new Map();
    data.forEach((item) => {
      const { category_id, category_name, quantity, price } = item;

      if (groupedDataMap.has(category_id)) {
        const existingData = groupedDataMap.get(category_id);
        existingData.quantity += quantity;
        existingData.price += price;
      } else {
        groupedDataMap.set(category_id, { category_id, category_name, quantity, price });
      }
    });

    const groupedDataArray = Array.from(groupedDataMap.values());
    if(groupedDataArray && groupedDataArray.length >0){
      if(sort=="name"){
        groupedDataArray.sort((a, b) => a?.category_name?.localeCompare(b?.category_name));
      }

      if(sort=="quantity"){
        groupedDataArray.sort((a, b) => b?.quantity - a?.quantity);
      }
      
      if(sort=="amount"){
        groupedDataArray.sort((a, b) => b?.price - a?.price);
      }
    }
    return groupedDataArray;
  } else {
    orderDetails.forEach((value) => {
      let data = {
        date: DateTime.Format(value.order_date),
        quantity: Number.Get(value.get("quantity")),
      };
      orderData.push(data);
    });
    return orderData;
  }
};

module.exports = {
  orderSearch,
  getDataByType,
};
