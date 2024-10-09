const { Op } = require("sequelize");

// Models
const {
  productIndex,
  PurchaseProduct,
  Purchase,
  account: accountModel,
  status: statusModel,
} = require("../../db").models;

// Util

const Request = require("../../lib/request");
const DateTime = require("../../lib/dateTime");
const { BAD_REQUEST } = require("../../helpers/Response");
const Boolean = require("../../lib/Boolean");
const validator = require("../../lib/validator");
const Currency = require("../../lib/currency");
const Number = require("../../lib/Number");
const  purchaseProduct  = require("../../helpers/purchaseProduct");
const String = require("../../lib/string");
const ProductPriceService =  require("../../services/ProductPriceService");


const search = async (req, res) => {
  try {
    //destructure the params
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
      showTotalAmount
    } = req.query;

    let timeZone = Request.getTimeZone(req);
    //get company Id from request
    const companyId = Request.GetCompanyId(req);

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

    //cretae where object
    let where = {};

    //get product details object
    let productDetailWhere = new Object();
    let purchaseWhere = new Object();


    //append the company id
    where.company_id = companyId;

    //validate stock entry Id exist or not
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
    
    let date = DateTime.getCustomDateTime(req?.query?.date, timeZone)

    if (date && Number.isNotNull(req?.query?.date)) {
      purchaseWhere.purchase_date = {
        [Op.and]: {
          [Op.gte]: date?.startDate,
          [Op.lte]: date?.endDate,
        },
      };
    }

    if (startDate && !endDate) {
      purchaseWhere.purchase_date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }

    if (endDate && !startDate) {
      purchaseWhere.purchase_date = {
        [Op.and]: {
          [Op.lte]: endDate,
        },
      };
    }

    if (startDate && endDate) {
      purchaseWhere.purchase_date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };
    }
    // Search term
    const searchTerm = search ? search.trim() : null;

    let filteredProductIds = await ProductPriceService.getProductIds(
      searchTerm,
      companyId
    );
    if (filteredProductIds && filteredProductIds.length > 0) {
      productDetailWhere.product_id = filteredProductIds;
    }

    //validate search term
    if (searchTerm && filteredProductIds.length == 0) {
      productDetailWhere[Op.or] = [
        {
          product_name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },

        {
          brand_name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    // Sortable Fields
    const validOrder = ["ASC", "DESC"];
    const sortableFields = {
      id: "id",
      product_name: "product_name",
      quantity: "quantity",
      unit_price: "unit_price",
      discount_amount: "discount_amount",
      tax_percentage: "tax_percentage",
      tax_amount: "tax_amount",
      net_amount: "net_amount",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      sale_price: "sale_price",
      size: "size",
      purchase_number: "purchase_number",
      purchase_date: "purchase_date",
      manufactured_date: "manufactured_date",
      margin_percentage: "margin_percentage",
      taxable_amount: "taxable_amount",
      mrp: "mrp",
      unit_margin_amount: "unit_margin_amount",
      vendor_name: "vendor_name",
    };
    const sortParam = sort || "createdAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      throw { message: `Unable to sort inventory by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      throw { message: "Invalid sort order" };
    }

    const include = [
      {
        required: true,
        model: accountModel,
        as: 'account',
      },
      {
        required: true,
        model: productIndex,
        as: "productIndex",
        where: productDetailWhere,
      },
      {
        required: true,
        model: Purchase,
        as: "purchaseDetail",
        where: purchaseWhere,
      },
      {
        required: false,
        model: statusModel,
        as: 'statusDetail',
      },
    ];

    let order = [];
    if (sort === "vendor_name") {
      order.push([
        { model: accountModel, as: "account" },
        "name",
        sortDirParam,
      ]);
    }
    if (sort === "product_name") {
      order.push(
        [{ model: productIndex, as: 'productIndex' }, 'brand_name', sortDir],
        [{ model: productIndex, as: 'productIndex' }, 'product_name', sortDir],
        [{ model: productIndex, as: 'productIndex' }, 'size', sortDir],
        [{ model: productIndex, as: 'productIndex' }, 'sale_price', sortDir]
      );
    }
    if (sort === "purchase_number" || sort == "purchase_date") {
      order.push(
        [{ model: Purchase, as: 'purchaseDetail' }, 'purchase_number', sortDir],
        [{ model: Purchase, as: 'purchaseDetail' }, 'purchase_date', sortDir]
      );
    }
    if (
      sort !== "product_name" &&
      sort !== "purchase_number" &&
      sort !== "purchase_date" &&
      sort !== "vendor_name" &&
      sort
    ) {
      order.push([sortParam, sortDirParam]);
    }
    //create query object
    const query = {
      attributes: { exclude: ["deletedAt"] },
      order,
      include,
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
    // Get Store list and count
    const purchaseProductList = await PurchaseProduct.findAndCountAll(query);

    let totalAmount = 0;
    let totalQty = 0;
    
    if(showTotalAmount){
    const totalQuery = {
      attributes: { exclude: ["deletedAt"] },
      order,
      include,
      where,
    };
    const purchaseProductData= await PurchaseProduct.findAll(totalQuery);
     totalQty = purchaseProductData.reduce((sum, item) => sum + Number.Get(item.quantity), 0);
     totalAmount = purchaseProductData.reduce((sum, item) => sum + Number.GetFloat(item.net_amount), 0);
    }

    //create purchaseProductEntry array
    const purchaseProductDetails =
      purchaseProductList && purchaseProductList.rows;
    const purchaseProductEntry = [];
    for (let i = 0; i < purchaseProductDetails.length; i++) {
      const {
        id,
        quantity,
        unit_price,
        productIndex,
        createdAt,
        updatedAt,
        purchase_id,
        product_id,
        discount_amount,
        tax_percentage,
        tax_amount,
        net_amount,
        purchaseDetail,
        owner_id,
        cgst_percentage,
        sgst_percentage,
        cess_percentage,
        cgst_amount,
        sgst_amount,
        cess_amount,
        manufactured_date,
        statusDetail,
        margin_percentage,
        igst_percentage,
        igst_amount,
        mrp,
        unit_margin_amount,
        taxable_amount,
        margin_amount,
        discount_percentage,
      } = purchaseProductDetails[i];
      const account = await accountModel.findOne({
        where: { id: purchaseDetail?.vendor_id, company_id: companyId },
      });

      const product_index = { ...productIndex.get() };

      const dateTime = new DateTime();
      //create date object
      const data = {
        id,
        unit_price: Currency.Get(unit_price),
        product_name: product_index.product_name,
        brand_id: product_index.brand_id,
        quantity: quantity,
        image: product_index.featured_media_url,
        purchase_id: purchase_id,
        product_id: product_id,
        discount_amount: discount_amount,
        tax_percentage: tax_percentage,
        tax_amount: tax_amount,
        price: parseFloat(unit_price) * parseInt(quantity, 10),
        size: product_index.size,
        brand_name: product_index.brand_name,
        sale_price: product_index.sale_price,
        mrp: product_index.mrp,
        unit: product_index.unit,
        purchase_date: purchaseDetail?.purchase_date,
        purchase_number: purchaseDetail?.purchase_number,
        vendor_name: account?.name,
        netAmount: net_amount,
        owner_id: owner_id,
        cgst_percentage: cgst_percentage,
        igst_percentage: igst_percentage,
        igst_amount: igst_amount,
        mrp: mrp,
        unit_margin_amount: unit_margin_amount,
        margin_amount: margin_amount,
        sgst_percentage: sgst_percentage,
        cess_percentage: cess_percentage,
        cgst_amount: cgst_amount,
        sgst_amount: sgst_amount,
        cess_amount: cess_amount,
        manufactured_date: manufactured_date,
        margin_percentage: Currency.Get(margin_percentage),
        status: statusDetail?.name,
        statusId: statusDetail && statusDetail.id,
        statusColor: statusDetail?.color_code,
        taxable_amount: taxable_amount,
        discount_percentage: discount_percentage,
      };

      // Formate Object Property
      (data.createdAt = createdAt), dateTime.formats.shortMonthDateAndTime;
      (data.updatedAt = updatedAt), dateTime.formats.shortMonthDateAndTime;

      //push the purchaseProductEntry
      purchaseProductEntry.push(data);
    }
    if(showTotalAmount){

    // Add dummy record as the 26th index
const lastRecord = {
  id: null,
  unit_price: null,
  product_name: null,
  brand_id: null,
  quantity: totalQty,
  image: null,
  purchase_id: null,
  product_id: null,
  discount_amount: null,
  tax_percentage: null,
  tax_amount: null,
  price: null,
  size: null,
  brand_name: null,
  sale_price: null,
  mrp: null,
  unit: null,
  purchase_date: null,
  purchase_number: null,
  vendor_name: null,
  netAmount: totalAmount,
  owner_id: null,
  cgst_percentage: null,
  igst_percentage: null,
  igst_amount: null,
  mrp: null,
  unit_margin_amount: null,
  margin_amount: null,
  sgst_percentage: null,
  cess_percentage: null,
  cgst_amount: null,
  sgst_amount: null,
  cess_amount: null,
  manufactured_date: null,
  margin_percentage: null,
  status: null,
  statusId: null,
  statusColor: null,
  taxable_amount: null,
  discount_percentage: null,
  createdAt: null,
  updatedAt: null
};

// Push the dummy record to the purchaseProductEntry array
purchaseProductEntry.push(lastRecord);
    }
    // //return response
    return res.json(200, {
      totalCount: purchaseProductList.count,
      currentPage: page,
      pageSize,
      data: purchaseProductEntry,
      sort,
      sortDir,
      search,
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = search;
