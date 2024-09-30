const { Op } = require("sequelize");
const { models,sequelize} = require("../../db")
const {  PurchaseProduct, Purchase, account: accountModel} = models;

const validator = require("../../lib/validator");

const Request = require("../../lib/request");
const { BAD_REQUEST } = require("../../helpers/Response");
const Boolean = require("../../lib/Boolean");

// ... Import necessary modules and models

const vendorSearch = async (req, res) => {
  try {
    // Destructure the parameters
    let {
      page,
      pageSize,
      search,
      sort,
      sortDir,
      pagination,
      purchaseId,
      product_id,
      startDate,
      endDate,
      account,
      brand,
      category,
      product,
    } = req.query;

    // Get company Id from the request
    const companyId = Request.GetCompanyId(req);

    // Validate page and page size
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(BAD_REQUEST, { message: "Invalid page" });
    }

    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(BAD_REQUEST, { message: "Invalid page size" });
    }

    // Create the 'where' object
    let where = {
      company_id: companyId,
    };

    // Create objects to store filtering criteria
    let productDetailWhere = {};
    let purchaseWhere = {};

    // Handle filtering criteria
    if (purchaseId) {
      where.purchase_id = purchaseId;
    }

    if (product_id) {
      where.product_id = product_id;
    }

    if (account) {
      purchaseWhere.vendor_id = account;
    }

    if (brand) {
      productDetailWhere.brand_id = brand;
    }

    if (category) {
      productDetailWhere.category_id = category;
    }

    if (product) {
      productDetailWhere.product_id = product;
    }

    

    // Search term
    

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      cost_price: "cost_price",
      purchase_date: "purchase_date",
      createdAt: "createdAt",
    };
    const sortParam = sort || "createdAt";

    // Validate sortable fields
    if (!Object.keys(sortableFields).includes(sortParam)) {
      throw { message: `Unable to sort inventory by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";

    // Validate sort order
    if (!validOrder.includes(sortDirParam)) {
      throw { message: "Invalid sort order" };
    }

    const include = [
      {
        required: true,
        model: Purchase,
        as: "purchaseDetail",
        where: purchaseWhere,
      },
    ];

  
    const query = {
      include,
      where,
      order: [['createdAt', 'DESC']],
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

    const purchaseProductList = await PurchaseProduct.findAndCountAll(query);

    const list = new Map();
    
    for (const product of purchaseProductList.rows) {
      const vendorId = product.vendor_id;
      const purchaseDate = product.purchaseDetail?.createdAt;
    
      if (!list.has(vendorId) || purchaseDate > list.get(vendorId).purchaseDetail?.createdAt) {
        list.set(vendorId, {
          purchaseDetail: product?.purchaseDetail,
          cost_price: product?.unit_price,
        });
      }
    }
    
    const details = [];
    
    for (const [vendorId, data] of list) {
      const account = await accountModel.findOne({
        where: {
          id: vendorId,
          company_id: companyId,
        },
      });
    
      const purchaseDate = data.purchaseDetail?.purchase_date;
    
      const result = {
        purchase_date: purchaseDate,
        vendor_name: account?.name,
        cost_price: data.cost_price,
      };
    
      details.push(result);
    }
    if (details && details.length > 0) {
        if(sort == "vendor_name" && sortDir == "ASC"){
          details.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name));

        }
        if(sort == "vendor_name" && sortDir == "DESC"){
          details.sort((a, b) => b.vendor_name.localeCompare(a.vendor_name));

        }
        if(sort == "purchase_date" && sortDir == "ASC"){
          details.sort((a, b) => a.purchase_date.localeCompare(b.purchase_date));

        }
        if(sort == "purchase_date" && sortDir == "DESC"){
          details.sort((a, b) => b.purchase_date.localeCompare(a.purchase_date));

        }
        if(sort == "cost_price" && sortDir == "ASC"){
          details.sort((a, b) => a.cost_price.localeCompare(b.cost_price));

        }
        if(sort == "cost_price" && sortDir == "DESC"){
          details.sort((a, b) => b.cost_price.localeCompare(a.cost_price));

        }
    }
    

    // Return the response
    return res.json(200, {
      currentPage: page,
      pageSize,
      data: details,
      sort,
      sortDir,
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = vendorSearch;
