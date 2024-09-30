const { Op } = require("sequelize");
const { BAD_REQUEST, OK } = require("../helpers/Response");
const DateTime = require("../lib/dateTime");
const Boolean = require("../lib/Boolean");
const validator = require("../lib/validator");
const {
  Purchase,
  Location,
  account: accountModel,
  User: userModel,
} = require("../db").models;

class PurchaseReportService {
  static async getReport(req, res, next) {
    let { page, pageSize, search, sort, sortDir, pagination, user, startDate, endDate, location, account } = req.query;
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
    const companyId = req.user && req.user.company_id;
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
      purchase_number: "purchase_number",
      location: "location",
      owner: "owner",
      vendorName: "vendorName",
      vendor_invoice_date: "vendor_invoice_date",
      vendor_invoice_number: "vendor_invoice_number",
      invoice_amount: "invoice_amount",
      returned_items_amount: "returned_items_amount",
      other_deduction_amount: "other_deduction_amount",
      net_amount: "net_amount",
      due_date: "due_date",
      purchase_date: "purchase_date",
    };
    const sortParam = sort || "createdAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort payments by ${sortParam}` });
    }
    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: "Invalid sort order" });
    }
    const where = {};
    where.company_id = companyId;
    if (user) {
      where.owner_id = user;
    }
    if (location) {
      where.store_id = location;
    }
    if (account) {
      where.vendor_id = account;
    }
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        { purchase_number: { [Op.iLike]: `%${searchTerm}%` } },
        {
          "$account.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          "$location.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          "$UserDetails.name$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        { vendor_invoice_number: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    if (startDate && !endDate) {
      where.purchase_date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }
    if (endDate && !startDate) {
      where.purchase_date = {
        [Op.and]: {
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }
    if (startDate && endDate) {
      where.purchase_date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }
    let sortOrder = [];
    if (sort == "location") {
      sortOrder.push([{ model: Location, as: "location" }, "name", sortDir]);
    }

    if (sort == "owner") {
      sortOrder.push([{ model: userModel, as: "UserDetails" }, "name", sortDir]);
    }
    if (sort == "vendorName") {
      sortOrder.push([{ model: accountModel, as: "account" }, "name", sortDir]);
    }
    if (sort && sort !== "location" && sort !== "vendorName" && sort !== "owner") {
      sortOrder.push([sortParam, sortDirParam]);
    }

    const query = {
      include: [
        {
          required: true,
          model: accountModel,
          as: "account",
        },
        {
          required: true,
          model: Location,
          as: "location",
        },
        {
          required: false,
          model: userModel,
          as: "UserDetails",
        },
      ],
      order: sortOrder,
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
    try {
      const purchaseList = await Purchase.findAndCountAll(query);
      let purchaseData = purchaseList && purchaseList.rows;
      const data = [];
      if (purchaseData && purchaseData.length > 0) {
        for (let i = 0; i < purchaseData.length; i++) {
          const {
            id,
            purchase_number,
            purchase_date,
            amount,
            location,
            account,
            UserDetails,
            vendor_invoice_number,
            vendor_invoice_date,
            invoice_amount,
            returned_items_amount,
            other_deduction_amount,
            owner_id,
            due_date,
            net_amount,
          } = purchaseData[i];
          data.push({
            id,
            purchase_number,
            purchase_date,
            amount,
            location: location && location?.name,
            vendorName: account && account?.name,
            vendor_invoice_number: vendor_invoice_number,
            vendor_invoice_date: vendor_invoice_date,
            invoice_amount: invoice_amount,
            returned_items_amount,
            other_deduction_amount,
            net_amount,
            due_date,
            firstName: UserDetails && UserDetails?.name,
            lastName: UserDetails && UserDetails?.last_name,
            image_url: UserDetails && UserDetails?.media_url,
          });
        }
      }
      res.json(OK, {
        totalCount: purchaseList.count,
        currentPage: page,
        pageSize,
        data,
        search,
        sort,
        sortDir,
      });
    } catch (err) {
      console.log(err);
      res.json(OK, { message: err.message });
    }
  }
}

module.exports = PurchaseReportService;
