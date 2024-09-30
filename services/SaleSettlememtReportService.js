const {
  Location,
  SaleSettlement
} = require("../db").models;

// Util
const {
  shortDateAndTime
} = require("../lib/dateTime");

const location = require("../helpers/Location");
const DateTime = require("../lib/dateTime");
const DataBaseService = require("../lib/dataBaseService");
const LocationService = new DataBaseService(Location);
const saleSettlementService = new DataBaseService(SaleSettlement);

const searchStore = async (params, companyId) => {

  try{
  const {
    Op
  } = require("sequelize");
  let {
    page,
    pageSize,
    search,
    sort,
    sortDir,
    pagination,
    shift,
    startDate,
    endDate
  } = params;
  // Validate if page is not a number
  page = page ? parseInt(page, 10) : 1;
  if (isNaN(page)) {
    throw {
      message: "Invalid page"
    };
  }

  // Validate if page size is not a number
  pageSize = pageSize ? parseInt(pageSize, 10) : 25;
  if (isNaN(pageSize)) {
    throw {
      message: "Invalid page size"
    };
  }

  // Sortable Fields
  const validOrder = ["ASC", "DESC"];
  const sortableFields = {
    id: "id",
    name: "name",
    status: "status",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  };

  const sortParam =  "name";
  // Validate sortable fields is present in sort param
  if (!Object.keys(sortableFields).includes(sortParam)) {
    throw {
      message: `Unable to sort Location by ${sortParam}`
    };
  }

  const sortDirParam =  "ASC";
  // Validate order is present in sortDir param
  if (!validOrder.includes(sortDirParam)) {
    throw {
      message: "Invalid sort order"
    };
  }

  let where = {};
  where.company_id = companyId;
  where.allow_sale = location.ENABLED;
  where.status = location.STATUS_ACTIVE;

  if (shift || startDate || endDate) {
    where.status = { [Op.or]: [location.STATUS_ACTIVE, location.STATUS_INACTIVE] }
  }
  // Search term
  const searchTerm = search ? search.trim() : null;
  if (searchTerm) {
    where[Op.or] = [{
      name: {
        [Op.iLike]: `%${searchTerm}%`,
      },
    },];
  }

  const query = {
    attributes: {
      exclude: ["deletedAt"]
    },
    order: [
      [sortParam, sortDirParam]
    ],
    where,
  };

  if (pagination) {
    if (pageSize > 0) {
      query.limit = pageSize;
      query.offset = (page - 1) * pageSize;
    }
  }

  // Get Location list and count
  const locationDetails = await LocationService.findAndCount(query);
  const locationData = [];

  for (let storeDetail of locationDetails.rows) {
    const {
      id,
      name,
      status,
      shopify_store_name,
      shopify_admin_api_version,
      shopify_api_key,
      createdAt,
      updatedAt,
    } = storeDetail;
    let saleWhere = {};
    if (startDate && !endDate) {
      saleWhere.date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }

    if (endDate && !startDate) {
      saleWhere.date = {
        [Op.and]: {
          [Op.lte]: endDate,
        },
      };
    }

    if (startDate && endDate) {
      saleWhere.date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };
    }
    saleWhere.store_id = id;
    saleWhere.company_id = companyId;

    if (shift)
      saleWhere.shift = shift
    let salesDetails = await saleSettlementService.findAndCount({
      where: saleWhere
    });
    let totalAmount = 0;

    let total_amount_upi = 0;
    let total_amount_cash = 0;

    for (let data of salesDetails.rows) {
      let salesData = {
        ...data.get()
      }
      totalAmount = totalAmount + Number(salesData.amount_cash) + Number(salesData.amount_upi)
      total_amount_upi += Number(salesData.amount_upi)
      total_amount_cash += Number(salesData.amount_cash)
    }

    const data = {
      id,
      name,
      status,
      shopifyStoreName: shopify_store_name ? shopify_store_name : "",
      shopifyAdminApiVersion: shopify_admin_api_version ?
        shopify_admin_api_version :
        "",
      shopifyApiKey: shopify_api_key ? shopify_api_key : "",
      totalAmount: totalAmount,
      total_amount_upi: total_amount_upi,
      total_amount_cash: total_amount_cash
    };
    // formate object property
    data.createdAt = shortDateAndTime(createdAt);
    data.updatedAt = shortDateAndTime(updatedAt);
    if (totalAmount > 0 || status == location.STATUS_ACTIVE) {
      locationData.push(data);
    }
  };
  return {
    totalCount: locationDetails.count,
    currentPage: page,
    pageSize,
    data: locationData,
    sort,
    sortDir,
  };
}catch(err){
  console.log(err);
}
};

const getDataBasedOnType = async (type, SalesDetails) => {
  let saleData = [];
  if (type == "month") {
    await SalesDetails.forEach(async (value) => {
      let year = await DateTime.getYear(value.date);
      year = String(year).slice(-2)
      let salesData = {
        amount: Number(value.get("amount_upi")) + Number(value.get("amount_cash")),
        date: DateTime.getMonth(value.date) + " " + year,
        amount_cash: value.get("amount_cash"),
        amount_upi: value.get("amount_upi"),
      }
      saleData.push(salesData)
    })
    saleData = await saleData.reduce((obj, item) => {
      let find = obj.find(i => i.date === item.date);
      let _d = {
        ...item
      }
      find ? (find.amount += item.amount) : obj.push(_d);
      return obj;
    }, [])
    return saleData
  } else if (type == "date") {
    SalesDetails.forEach((value) => {
      let salesData = {
        date: DateTime.Format(value.date),
        amount_cash: value.get("amount_cash"),
        amount_upi: value.get("amount_upi"),
        amount: Number(value.get("amount_upi")) + Number(value.get("amount_cash")),
      }
      saleData.push(salesData)
    })
    saleData = saleData.reduce((obj, item) => {
      let find = obj.find(i => i.date === item.date);
      let _d = {
        ...item
      }
      find ? (find.amount += item.amount) : obj.push(_d);
      return obj;
    }, [])
    return saleData
  }

}
module.exports = {
  searchStore,
  getDataBasedOnType
};