const {
  Location: LocationModel,
  AddressModel,
  SaleSettlement,
} = require("../db").models;

// Util
const { shortDateAndTime } = require("../lib/dateTime");

const Location = require("../helpers/Location");

const crypto = require("../lib/crypto");

const Attendance = require("../helpers/Attendance");
const DateTime = require("../lib/dateTime");
const String = require("../lib/string");
const Currency = require("../lib/currency");
const DataBaseService = require("../lib/dataBaseService");
const locationModel = new DataBaseService(LocationModel);
const Boolean = require("../lib/Boolean");
const validator = require("../lib/validator");
const AddressService = require("../services/AddressService");
const ObjectName = require("../helpers/ObjectName");
const SettingService = require("../services/SettingService");
const Setting = require("../helpers/Setting");
const NumberLib = require("../lib/Number");
const Time = require("../lib/time");
const { UPDATE_SUCCESS } = require("../helpers/Response");
const History = require("./HistoryService");
const { LOCATION } = require("../helpers/ObjectName");
const { getContactById } = require("./ContactService");
const Request = require("../lib/request");
const Response = require("../helpers/Response");

/**
 * Check whether Location exist or not by name
 *
 * @param {*} name
 * @returns {*} false if not exist else details
 */
const isExistByName = async (name, companyId) => {
  try {
    if (!name) {
      throw { message: "Location name is required" };
    }

    const locationDetails = await locationModel.findOne({
      where: { name, company_id: companyId },
    });

    if (!locationDetails) {
      return false;
    }

    return locationDetails.get();
  } catch (err) {
    console.log(err);
  }
};

/**
 * Check whether Location exist or not by id
 *
 * @param {*} id
 * @returns {*} false if not exist else details
 */
const isExistById = async (id) => {
  try {
    if (!parseInt(id)) {
      throw { message: "Location id is required" };
    }

    const locationDetails = await locationModel.findOne({
      where: { id },
    });

    if (!locationDetails) {
      return false;
    }

    return locationDetails.get();
  } catch (err) {
    console.log(err);
  }
};

/**
 *  Create Location
 *
 * @param {*} data
 */
const createStore = async (data) => {
  let where={};
  where.company_id = data.companyId
  const sortOrder = await locationModel.findOne({ where, attributes: ["sort_order"], order: [["updatedAt", "DESC"]] });
  let sortNumber;
  if (sortOrder) {
    sortNumber = sortOrder?.dataValues?.sort_order + 1;
  } else {
    sortNumber = 1;
  }
  try {
    const createData = {
      name: data.name,
      status: data.status,
      company_id: data.companyId,
      sort_order: sortNumber
    };

    const locationData = await locationModel.create(createData);

    return locationData;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get Location details by storeId
 *
 * @param {*} storeId
 */
const getLocationDetails = async (storeId, companyId) => {
  try {
    const locationDetails = await isExistById(storeId);
    let userDefaultTimeZone = await SettingService.getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);

    if (!locationDetails) {
      throw { message: "Location not found" };
    }


    let contectDetail = await getContactById(storeId,ObjectName.LOCATION,companyId);
    const {
      id,
      name,
      status,
      shopify_store_name,
      shopify_admin_api_version,
      shopify_api_key,
      shopify_password,
      createdAt,
      updatedAt,
      address1,
      address2,
      city,
      state,
      country,
      pin_code,
      email,
      mobile_number1,
      mobile_number2,
      start_date,
      end_date,
      allow_sale,
      ip_address,
      minimum_cash_in_store,
      cash_in_location,
      distribution_center,
      print_name,
      color,
      allow_replenishment,
      allow_purchase,
      location_code,
      sales_settlement_required,
      last_order_number,
      longitude,
      latitude,
      type,
      open_time,
      close_time,
      allowed_shift,
      allow_check_in

    } = locationDetails;

    const data = {
      id: id,
      name: name,
      status: status,
      shopifyStoreName: shopify_store_name ? shopify_store_name : "",
      shopifyAdminApiVersion: shopify_admin_api_version ? shopify_admin_api_version : "",
      shopifyApiKey: shopify_api_key ? shopify_api_key : "",
      shopifyPassword: shopify_password ? shopify_password : "",
      address1: address1,
      address2: address2,
      city: city,
      state: state,
      country: country,
      pin_code: pin_code,
      email: email,
      mobile_number1: mobile_number1,
      mobile_number2: mobile_number2,
      start_date: start_date,
      end_date: end_date,
      ip_address,
      allow_sale: allow_sale == Location.ENABLED ? true : false,
      encryptedStoreID: await Attendance.getQRCode(companyId, storeId),
      minimum_cash_in_store: Currency.Get(minimum_cash_in_store),
      cash_in_location: Currency.Get(cash_in_location),
      distributionCenter: distribution_center,
      printName: print_name,
      color: color,
      allow_replenishment: allow_replenishment == Location.ALLOW_REPLENISHMENT_ENABLED ? true : false,
      allow_purchase: allow_purchase == Location.ALLOW_PURCHASE_ENABLED ? true : false,
      location_code: location_code,
      sales_settlement_required: sales_settlement_required == Location.SALES_SETTLEMENT_REQUIRED_ENABLED ? true : false,
      allow_check_in: allow_check_in == Location.ALLOW_CHECKIN_ENABLED ? true : false,
      last_order_number: last_order_number ? last_order_number : "",
      longitude: longitude,
      latitude: latitude,
      type: type,
      allowed_shift,
      open_time: open_time ? DateTime.convertGmtTimeToDateTimeByUserProfileTimezone(open_time, new Date(), userDefaultTimeZone) : "",
      close_time: close_time ? DateTime.convertGmtTimeToDateTimeByUserProfileTimezone(close_time, new Date(), userDefaultTimeZone) : "",
      mobile_number: contectDetail && contectDetail?.mobile

    };
    // formate object property
    data.createdAt = shortDateAndTime(createdAt);
    data.updatedAt = shortDateAndTime(updatedAt);

    return data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Update Location details by storeId
 *
 * @param {*} storeId
 * @param {*} data
 */
const updateStoreById = async (storeId, data, companyId, req, res) => {
  try {
    const locationDetails = await isExistById(storeId);
    if (!locationDetails) {
      throw { message: "Location not found" };
    }
    const {
      name,
      status,
      shopify_shop_name,
      shopify_admin_api_version,
      shopify_api_key,
      shopify_password,
      distributionCenter,
      printName,
    } = data;
    // Update data

    let updateData = {};
    let historyMessage = new Array();
    if (name !== undefined && name !== locationDetails.name) {
      updateData.name = name;
      historyMessage.push(
        `Location name Updated from ${locationDetails.name} to ${name}\n`
      );
    }
    if (status !== undefined && status !== locationDetails.status) {
      updateData.status = status;
      historyMessage.push(
        `Location status Updated from ${locationDetails.status} to ${status}\n`
      );
    }

    if (
      shopify_shop_name !== undefined &&
      shopify_shop_name !== locationDetails.shopify_store_name
    ) {
      updateData.shopify_store_name = shopify_shop_name;
      historyMessage.push(
        `Location shopify shop name is  Updated from ${locationDetails.shopify_store_name} to ${shopify_shop_name}\n`
      );
    }

    if (
      shopify_admin_api_version !== undefined &&
      shopify_admin_api_version !== locationDetails.shopify_admin_api_version
    ) {
      updateData.shopify_admin_api_version = shopify_admin_api_version;
      historyMessage.push(
        `Location Shopify Admin Api Version Updated from ${locationDetails.shopify_admin_api_version} to ${shopify_admin_api_version}\n`
      );
    }

    if (
      shopify_api_key !== undefined &&
      shopify_api_key !== locationDetails.shopify_api_key
    ) {
      updateData.shopify_api_key = shopify_api_key;
      historyMessage.push(
        `Location Shopify Api key Updated from ${locationDetails.shopify_api_key} to ${shopify_api_key}\n`
      );
    }

    if (
      shopify_password !== undefined &&
      shopify_password !== locationDetails.shopify_password
    ) {
      updateData.shopify_password = shopify_password;
      historyMessage.push(
        `Location Shopify Password Updated from ${locationDetails.shopify_password} to ${shopify_password}\n`
      );
    }

    if (
      data.address1 !== undefined &&
      data.address1 !== locationDetails.address1
    ) {
      updateData.address1 = data.address1;
      historyMessage.push(
        `Location address1 Updated from ${locationDetails.address1} to ${data.address1}\n`
      );
    }

    if (
      data.address2 !== undefined &&
      data.address2 !== locationDetails.address2
    ) {
      updateData.address2 = data.address2;
      historyMessage.push(
        `Location address2 Updated from ${locationDetails.address2} to ${data.address2}\n`
      );
    }

    if (data.city !== undefined && data.city !== locationDetails.city) {
      updateData.city = String.Get(data.city);
      historyMessage.push(
        `Location City Updated from ${locationDetails.city} to ${data.city}\n`
      );
    }
    if (
      data?.allowed_shift !== undefined &&
      data?.allowed_shift !== locationDetails?.allowed_shift
    ) {
      updateData.allowed_shift = data?.allowed_shift ? data?.allowed_shift : "";
      historyMessage.push(
        `Location allowed shift   Updated from ${locationDetails.allowed_shift} to ${updateData.allowed_shift}\n`
      );
    }
    if (data.state !== undefined && data.state !== locationDetails.state) {
      updateData.state = String.Get(data.state);
      historyMessage.push(
        `Location State Updated from ${locationDetails.state} to ${data.state}\n`
      );
    }

    if (
      data.country !== undefined &&
      data.country !== locationDetails.country
    ) {
      updateData.country = data.country;
      historyMessage.push(
        `Location Country Updated from ${locationDetails.country} to ${data.country}\n`
      );
    }

    if (
      data.pin_code !== undefined &&
      data.pin_code !== locationDetails.pin_code
    ) {
      updateData.pin_code = data.pin_code;
      historyMessage.push(
        `Location Pincode Updated from ${locationDetails.pin_code} to ${data.pin_code}\n`
      );
    }

    if (data.email !== undefined && data.email !== locationDetails.email) {
      updateData.email = data.email;
      historyMessage.push(
        `Location Email Updated from ${locationDetails.email} to ${data.email}\n`
      );
    }

    if (
      data.mobile_number1 !== undefined &&
      data.mobile_number1 !== locationDetails.mobile_number1
    ) {
      updateData.mobile_number1 = data.mobile_number1;
      historyMessage.push(
        `Location Mobile number1  Updated from ${locationDetails.mobile_number1} to ${data.mobile_number1}\n`
      );
    }

    if (
      data.mobile_number2 !== undefined &&
      data.mobile_number2 !== locationDetails.mobile_number2
    ) {
      updateData.mobile_number2 = data.mobile_number2;
      historyMessage.push(
        `Location Mobile number2  Updated from ${locationDetails.mobile_number2} to ${data.mobile_number2}\n`
      );
    }

    if (
      data.start_date !== undefined &&
      DateTime.shortMonthDate(data.start_date) !==
        DateTime.shortMonthDate(locationDetails.start_date)
    ) {
      updateData.start_date = DateTime.formateDateAndTime(data.start_date);
      historyMessage.push(
        `Location start date  Updated from ${DateTime.shortMonthDate(
          locationDetails.start_date
        )} to ${DateTime.shortMonthDate(data.start_date)}\n`
      );
    }
    if (
      data.end_date !== undefined &&
      DateTime.shortMonthDate(data.end_date) !==
        DateTime.shortMonthDate(locationDetails.end_date)
    ) {
      updateData.end_date = DateTime.formateDateAndTime(data.end_date);
      historyMessage.push(
        `Location end date  Updated from ${DateTime.shortMonthDate(
          locationDetails.end_date
        )} to ${DateTime.shortMonthDate(data.end_date)}\n`
      );
    }
    if (
      data.open_time !== undefined &&
      data.open_time !== locationDetails.open_time
    ) {
      updateData.open_time = data?.open_time
        ? DateTime.formateDateAndTime(data?.open_time)
        : null;
      historyMessage.push(
        `Location open time Updated from ${
          locationDetails.open_time
            ? Time.formatTime(locationDetails.open_time)
            : ""
        } to ${DateTime.formatDateTime(updateData.open_time)}\n`
      );
    }

    if (
      data.close_time !== undefined &&
      data.close_time !== locationDetails.close_time
    ) {
      updateData.close_time = data?.close_time
        ? DateTime.formateDateAndTime(data?.close_time)
        : null;
      historyMessage.push(
        `Location close time Updated from ${
          locationDetails.close_time
            ? Time.formatTime(locationDetails.close_time)
            : ""
        } to ${
          data.close_time ? DateTime.formatDateTime(data.close_time) : ""
        }\n`
      );
    }

    if (
      data.ip_address !== undefined &&
      data.ip_address !== locationDetails.ip_address
    ) {
      updateData.ip_address = data.ip_address;
      historyMessage.push(
        `Location ip_address Updated from ${locationDetails.ip_address} to ${data.ip_address}\n`
      );
    }

    if (
      data.minimum_cash_in_store !== undefined &&
      Currency.Get(data.minimum_cash_in_store) !== Currency.Get(locationDetails.minimum_cash_in_store)
    ) {
      updateData.minimum_cash_in_store = data.minimum_cash_in_store
        ? data.minimum_cash_in_store
        : null;
      historyMessage.push(
        `Location  cash in store Updated from ${locationDetails.minimum_cash_in_store} to ${data.minimum_cash_in_store}\n`
      );
    }
    if (
      data.cash_in_location !== undefined &&
      Currency.Get(data.cash_in_location) !== Currency.Get(locationDetails.cash_in_location)
    ) {
      updateData.cash_in_location = data.cash_in_location
        ? data.cash_in_location
        : null;
      historyMessage.push(
        `Location  cash in store Updated from ${locationDetails.cash_in_location} to ${data.cash_in_location}\n`
      );
    }

    if (data.type !== undefined && data.type !== locationDetails.type) {
      let updatedTypeData =
        data.type == Location.TYPE_DISTRIBUTION_CENTER
          ? Location.DISTRIBUTION_CENTER
          : data.type == Location.TYPE_OFFICE
          ? Location.OFFICE_Text
          : data.type == Location.TYPE_STORE
          ? Location.STORE_TEXT
          : "";
      let locationTypeData =
        locationDetails.type == Location.TYPE_DISTRIBUTION_CENTER
          ? Location.DISTRIBUTION_CENTER
          : locationDetails.type == Location.TYPE_OFFICE
          ? Location.OFFICE_Text
          : locationDetails.type == Location.TYPE_STORE
          ? Location.STORE_TEXT
          : "";

      updateData.type = NumberLib.Get(data.type);
      historyMessage.push(
        `Location  type  Updated from ${locationTypeData} to ${updatedTypeData}\n`
      );
    }

    if (data.color !== undefined && data.color !== locationDetails.color) {
      updateData.color = data.color;
      historyMessage.push(
        `Location  Color  Updated from ${locationDetails.color} to ${data.color}\n`
      );
    }

    const allowSale =
      locationDetails.allow_sale == Location.ENABLED ? "true" : "false";
    if (data?.allow_sale !== undefined && data?.allow_sale !== allowSale) {
      updateData.allow_sale =
        data?.allow_sale !== undefined && data?.allow_sale == "true"
          ? Location.ENABLED
          : Location.DISABLED;
      historyMessage.push(
        `Location  allow sale  Updated from ${allowSale} to ${
          updateData.allow_sale == Location.ENABLED ? "true" : "false"
        }\n`
      );
    }

    const allowReplenishment =
      locationDetails.allow_replenishment ==
      Location.ALLOW_REPLENISHMENT_ENABLED
        ? "true"
        : "false";
    if (
      data?.allow_replenishment !== undefined &&
      data?.allow_replenishment !== allowReplenishment
    ) {
      updateData.allow_replenishment =
        data?.allow_replenishment !== undefined &&
        data?.allow_replenishment == "true"
          ? Location.ALLOW_REPLENISHMENT_ENABLED
          : Location.ALLOW_REPLENISHMENT_DISABLED;
      historyMessage.push(
        `Location  allow replenishment  Updated from ${allowReplenishment} to ${
          updateData.allow_replenishment == Location.ALLOW_REPLENISHMENT_ENABLED
            ? true
            : false
        }\n`
      );
    }

    const allowPurchase =
      locationDetails.allow_purchase == Location.ENABLED ? "true" : "false";
    if (
      data?.allow_purchase !== undefined &&
      data?.allow_purchase !== allowPurchase
    ) {
      updateData.allow_purchase =
        data?.allow_purchase !== undefined && data?.allow_purchase == "true"
          ? Location.ALLOW_PURCHASE_ENABLED
          : Location.ALLOW_PURCHASE_DISABLED;
      historyMessage.push(
        `Location  allow purchase  Updated from ${allowPurchase} to ${
          updateData.allow_purchase == Location.ALLOW_PURCHASE_ENABLED
            ? "true"
            : "false"
        }\n`
      );
    }

    if (
      data.location_code !== undefined &&
      data?.location_code !== locationDetails.location_code
    ) {
      updateData.location_code = data?.location_code;
      historyMessage.push(
        `Location  code  Updated from ${locationDetails.location_code} to ${updateData.location_code}\n`
      );
    }
    if (
      data?.last_order_number !== undefined &&
      data?.last_order_number !== locationDetails?.last_order_number
    ) {
      updateData.last_order_number = data.last_order_number
        ? data.last_order_number
        : null;
      historyMessage.push(
        `Location  last order number  Updated from ${locationDetails.last_order_number} to ${updateData.last_order_number}\n`
      );
    }
    const salesSettlementRequired =
      locationDetails.sales_settlement_required == Location.ENABLED
        ? "true"
        : "false";
    if (
      data.sales_settlement_required !== undefined &&
      data?.sales_settlement_required !== salesSettlementRequired
    ) {
      updateData.sales_settlement_required =
        data?.sales_settlement_required !== undefined &&
        data?.sales_settlement_required == "true"
          ? Location.SALES_SETTLEMENT_REQUIRED_ENABLED
          : Location.SALES_SETTLEMENT_REQUIRED_DISABLED;
      historyMessage.push(
        `Location Allow  Sales settlement  required Updated from ${salesSettlementRequired} to ${
          updateData?.sales_settlement_required ===
          Location.SALES_SETTLEMENT_REQUIRED_ENABLED
            ? true
            : false
        }\n`
      );
    }


    const allowCheckIn =
    locationDetails.allow_check_in == Location.ALLOW_CHECKIN_ENABLED ? "true" : "false";
  if (
    data?.allow_check_in !== undefined &&
    data?.allow_check_in !== allowCheckIn
  ) {
    updateData.allow_check_in =
      data?.allow_check_in !== undefined && data?.allow_check_in == "true"
        ? Location.ALLOW_CHECKIN_ENABLED
        : Location.ALLOW_CHECKIN_DISABLED;
    historyMessage.push(
      `Location  allow CheckIn  Updated from ${allowCheckIn} to ${
        updateData.allow_check_in == Location.ALLOW_CHECKIN_ENABLED
          ? "true"
          : "false"
      }\n`
    );
  }


    if (
      distributionCenter !== undefined &&
      distributionCenter !== locationDetails.distribution_center
    ) {
      const locationDetailsDistributionCenter = await isExistById(
        locationDetails.distribution_center
      );

      const updateDistributionCenter = await isExistById(distributionCenter);
      updateData.distribution_center = distributionCenter
        ? distributionCenter
        : null;
      historyMessage.push(
        `Location  distribution center   Updated from ${locationDetailsDistributionCenter?.name} to ${updateDistributionCenter?.name}\n`
      );
    }
    if (
      data?.latitude !== undefined &&
      data?.latitude !== locationDetails?.latitude
    ) {
      updateData.latitude = data?.latitude ? data?.latitude : "";
      historyMessage.push(
        `Location  latitude   Updated from ${locationDetails.latitude} to ${updateData.latitude}\n`
      );
    }
    if (
      data?.longitude !== undefined &&
      data?.longitude !== locationDetails?.longitude
    ) {
      updateData.longitude = data?.longitude ? data?.longitude : "";
      historyMessage.push(
        `Location  longitude   Updated from ${locationDetails.longitude} to ${updateData.longitude}\n`
      );
    }

    if (
      validator.isNotEmpty(printName) &&
      printName !== locationDetails.print_name
    ) {
      updateData.print_name = printName;
      historyMessage.push(
        `Location  print name   Updated from ${locationDetails.print_name} to ${updateData.print_name}\n`
      );
    }

    const save = await locationModel.update(updateData, {
      where: { id: storeId },
    });

    // API response
    res.json(UPDATE_SUCCESS, {
      message: "Location Updated ",
      data: save,
      values: data,
    });

    res.on("finish", async () => {
      // create system log for ticket updation
      if (historyMessage && historyMessage.length > 0) {
        let message = historyMessage.join();
        History.create(message, req, ObjectName.LOCATION, storeId);
      } else {
        History.create(" Location Updated", req, ObjectName.LOCATION, storeId);
      }
    });
  } catch (err) {
    console.log(err);
  }
};


const updateStoreByStatus = async (storeId, data) => {
  try {
    const { status } = data;

    // Update data
    const updateData = {
      status,
    };

    const save = await locationModel.update(updateData, {
      where: { id: storeId },
    });

    return save;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Search Location
 *
 * @param {*} params
 */
const searchStore = async (params, companyId) => {
  try {
    const { Op } = require("sequelize");
    let { page, pageSize, search, sort, sortDir, pagination, status, excludeIds, ip_address, location, allowSale } = params;
    let userDefaultTimeZone = await SettingService.getSettingValue(Setting.USER_DEFAULT_TIME_ZONE, companyId);


    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      throw { message: "Invalid page" };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      throw { message: "Invalid page size" };
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      name: "name",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      minimum_cash_in_store: "minimum_cash_in_store",
      cash_in_location: "cash_in_location",
      sort_order: "sort_order",
    };

    const sortParam = sort || "name";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      throw { message: `Unable to sort Location by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      throw { message: "Invalid sort order" };
    }

    let where = {};

    where.company_id = companyId;

    if (status) {
      where.status = status;
    }
    if (allowSale) {
      where.allow_sale = allowSale
    }

    if (ip_address) {
      where.ip_address = ip_address;
    }
    if (excludeIds) {
      let ids = excludeIds;
      let excludedIds = ids.split(',').map(Number)
      where.id = { [Op.notIn]: excludedIds }
    }

    if (location) {
      where.id = location;
    }
    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          ip_address: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const query = {
      attributes: { exclude: ["deletedAt"] },
      order: [[sortParam, sortDirParam]],
      where,
    };
    if (validator.isEmpty(pagination)) {
      pagination = true;
    }
    if (Boolean.isTrue(pagination)) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    // Get Location list and count
    const locationDetails = await locationModel.findAndCount(query);

    const locationData = [];
    let saleSettlementWhere = {}

    saleSettlementWhere.company_id = companyId

    if (params.currentDate) {
      saleSettlementWhere.date = params.currentDate
    }

    for (let storeDetail of locationDetails.rows) {
      const { id, name, status, shopify_store_name, shopify_admin_api_version, shopify_api_key, createdAt, updatedAt, print_name,
        ip_address,
        minimum_cash_in_store,
        cash_in_location,
        distribution_center,
        color,
        start_date,
        end_date,
        allow_sale,
        allow_replenishment,
        location_code,
        last_order_number,
        allow_purchase, open_time, close_time } =
        storeDetail;

      saleSettlementWhere.store_id = id
      let salesDetails = await SaleSettlement.findAndCountAll({
        where: saleSettlementWhere,
      });
      let totalAmount = 0;

      for (let data of salesDetails.rows) {
        let salesData = { ...data.get() };

        totalAmount = totalAmount + Number(salesData.amount_cash) + Number(salesData.amount_upi);
      }

      const data = {
        id,
        name,
        status,
        shopifyStoreName: shopify_store_name ? shopify_store_name : "",
        shopifyAdminApiVersion: shopify_admin_api_version ? shopify_admin_api_version : "",
        shopifyApiKey: shopify_api_key ? shopify_api_key : "",
        totalAmount: params.currentDate ? Currency.IndianFormat(totalAmount) : totalAmount,
        total_amount: totalAmount,
        print_name,
        ip_address,
        minimum_cash_in_store,
        cash_in_location,
        distribution_center,
        color,
        start_date,
        end_date,
        allow_sale: allow_sale == Location.ENABLED ? true : false,
        allow_replenishment: allow_replenishment == Location.ALLOW_REPLENISHMENT_ENABLED ? true : false,
        allow_purchase: allow_purchase == Location.ALLOW_PURCHASE_ENABLED ? true : false,
        encryptedId: await Attendance.getQRCode(companyId, id),
        location_code,
        last_order_number,
        open_time: open_time ? DateTime.convertGmtTimeToDateTimeByUserProfileTimezone(open_time, new Date(), userDefaultTimeZone) : "",
        close_time: close_time ? DateTime.convertGmtTimeToDateTimeByUserProfileTimezone(close_time, new Date(), userDefaultTimeZone) : "",
      };

      // formate object property
      data.createdAt = shortDateAndTime(createdAt);
      data.updatedAt = shortDateAndTime(updatedAt);

      locationData.push(data);
    }
    return {
      totalCount: locationDetails.count,
      currentPage: page,
      pageSize,
      data: locationData,
      sort,
      sortDir,
    };
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get Location details by storeId
 *
 * @param {*} storeId
 */
const deleteStore = async (storeId) => {
  try {
    const locationDetails = await isExistById(storeId);

    if (!locationDetails) {
      throw { message: "Location not found" };
    }

    return await locationModel.delete({ where: { id: storeId } });
  } catch (err) {
    console.log(err);
  }
};

const search = async (companyId) => {
  try {
    const storeList = await locationModel.find({
      where: {
        company_id: companyId,
        status: Location.STATUS_ACTIVE
      },
      order: [["name", "ASC"]],
    })
    return storeList;
  } catch (err) {
    console.log(err);
  }
};

const GetStoreByIpAddress = async (ipAddress, companyId) => {
  try {
    const location = await locationModel.findOne({ where: { ip_address: ipAddress, company_id: companyId } })
    return location;
  } catch (err) {
    console.log(err);
  }
}
const GetStoreByLocation = async (objectName, companyId) => {
  let where = {};
  if (objectName) {
    where.object_name = objectName;
  }
  where.company_id = companyId;
  const location = await AddressModel.findAll({ where: where });
  return location;
};



const updateLastOrderNumber = (location_id, companyId, last_order_number) => {
  locationModel.update(
    { last_order_number: parseInt(last_order_number) },
    {
      where: {
        id: location_id,
        company_id: companyId,
      },
    }
  );
}


const getLoationInAllowdLocationsByGeoLocation = async (longitude, latitude, roleId, companyId) => {
  try {

    if (longitude && latitude) {

      let allowedLocationsValues = await SettingService.getSettingValueByObject(Setting.ALLOWED_LOCATIONS, companyId, roleId, ObjectName.ROLE);

      let locationDetail;

      if (allowedLocationsValues) {

        const allowedLocations = allowedLocationsValues && allowedLocationsValues.split(",");

        if (allowedLocations && allowedLocations.length > 0) {

          for (let i = 0; i < allowedLocations.length; i++) {

            locationDetail = await locationModel.findOne({ where: { company_id: companyId, id: NumberLib.Get(allowedLocations[i]), latitude: String.ParseString(NumberLib.truncateDecimal(latitude, 3)), longitude: String.ParseString(NumberLib.truncateDecimal(longitude, 3)) } })

            if (locationDetail) {
              break;
            }
          }

        }
      } else {
        locationDetail = await locationModel.findOne({ where: { company_id: companyId, latitude: String.ParseString(NumberLib.truncateDecimal(latitude, 3)), longitude: String.ParseString(NumberLib.truncateDecimal(longitude, 3)) } })

      }

      return locationDetail;
    }

  } catch (err) {
    console.log(err);
  }
}

const getLocationInAllowdLocationsByIpAddress = async (ipAddress, roleId, companyId) => {
  try {

    if (ipAddress) {

      let allowedLocationsValues = await SettingService.getSettingValueByObject(Setting.ALLOWED_LOCATIONS, companyId, roleId, ObjectName.ROLE);

      let locationDetail;

      if (allowedLocationsValues) {

        const allowedLocations = allowedLocationsValues && allowedLocationsValues.split(",");

        if (allowedLocations && allowedLocations.length > 0) {

          for (let i = 0; i < allowedLocations.length; i++) {

            let location = await locationModel.findOne({ where: { ip_address: ipAddress, company_id: companyId, id: allowedLocations[i] } })

            if (location) {
              locationDetail = location;
              break;
            }

          }
        }

      } else {
        let location = await locationModel.findOne({ where: { ip_address: ipAddress, company_id: companyId } })

        if (location) {
          locationDetail = location;
        }

      }
      return locationDetail;
    }
  } catch (err) {
    console.log(err);
  }
}

const updateSortOrder = async (req, res) => {
  const companyId = Request.GetCompanyId(req);
  try {
    const newOrder = req.body;
    for (let i = 0; i < newOrder.length; i++) {
      await locationModel.update(
        { sort_order: i + 1 },
        {
          where: {
            id: newOrder[i].id,
            company_id: companyId,
          },
        }
      );
    }
    res.json(Response.OK, {
      message: "Location Order Updated.",
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const getName=async (locationId, companyId)=>{
  let locationDetail = await locationModel.findOne({ where: { id: locationId, company_id: companyId } });
  if(locationDetail){
    return locationDetail && locationDetail?.name
  }
  return null
}

const list = async (companyId,where={}) => {
  let locationDetail = await locationModel.find({ where: { company_id: companyId, status: Location.STATUS_ACTIVE, ...where }, order: [["name", "ASC"]] });
  if (locationDetail) {
    return locationDetail;
  }
  return null
}


module.exports = {
  createStore,
  isExistByName,
  isExistById,
  getLocationDetails,
  updateStoreById,
  updateStoreByStatus,
  searchStore,
  deleteStore,
  search,
  GetStoreByIpAddress,
  updateLastOrderNumber,
  GetStoreByLocation,
  getLoationInAllowdLocationsByGeoLocation,
  getLocationInAllowdLocationsByIpAddress,
  updateSortOrder,
  getName,
  list
};
