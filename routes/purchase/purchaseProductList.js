const { Op } = require("sequelize");

// Models
const {
  productIndex,
  PurchaseProduct,
  Purchase,
  account: accountModel,
  status: statusModel,
  AccountProductModel,
} = require("../../db").models;

// Util

const Request = require("../../lib/request");
const DateTime = require("../../lib/dateTime");
const { BAD_REQUEST } = require("../../helpers/Response");
const Boolean = require("../../lib/Boolean");
const validator = require("../../lib/validator");
const Currency = require("../../lib/currency");
const { purchaseProduct, status } = require("../../helpers/purchaseProduct");
const String = require("../../lib/string");
const Number = require("../../lib/Number");
const ProductPriceService = require("../../services/ProductPriceService");
const Status = require("../../helpers/Status");

const purchaseProductList = async (req, res) => {
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
      vendorId,
      billId,
    } = req.query;
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
    if (Number.isNotNull(purchaseId)) {
      where.purchase_id = purchaseId;
    }

    if (Number.isNotNull(vendorId)) {
      purchaseWhere.vendor_id = vendorId;
    }

    if (Number.isNotNull(billId)) {
      purchaseWhere.bill_id = billId;
    }

    // Search term
    const searchTerm = search ? search.trim() : null;

    let filteredProductIds = await ProductPriceService.getProductIds(
      searchTerm,
      companyId
    );

    if (filteredProductIds && filteredProductIds.length > 0) {
      where.product_id = filteredProductIds;
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
      unit_margin_amount: "unit_margin_amount",
      mrp: "mrp",
    };
    const sortParam = sort || "createdAt";
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      throw { message: `Unable to sort inventory by ${sortParam}` };
    }

    let sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      throw { message: "Invalid sort order" };
    }
    if (sortDirParam === "ASC") {
      sortDirParam += " NULLS FIRST";
    } else {
      sortDirParam += " NULLS LAST";
    }
    const include = [
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
        as: "statusDetail",
      },
    ];

    let order = [];
    if (sort === "product_name") {
      order.push(
        [{ model: productIndex, as: "productIndex" }, "brand_name", sortDir],
        [{ model: productIndex, as: "productIndex" }, "product_name", sortDir],
        [{ model: productIndex, as: "productIndex" }, "size", sortDir],
        [{ model: productIndex, as: "productIndex" }, "sale_price", sortDir]
      );
    }

    if (
      sort !== "product_name" &&
      sort !== "purchase_number" &&
      sort !== "purchase_date" &&
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

    const totalAmountQuery = {
      include,
      where,
    };

    let totalNetAmount = 0;
    let totalTaxAmount = 0;
    let totalTaxableAmount = 0;
    let totalMarginAmount = 0;
    let totalRejectedProductAmount=0
    let totalNotReceivedProductAmount=0

    const purchaseProductLists = await PurchaseProduct.findAndCountAll(
      totalAmountQuery
    );

    purchaseProductLists.rows.forEach((purchaseProducts) => {
      if (
        purchaseProducts.net_amount &&
        purchaseProducts.net_amount !== null &&
        !isNaN(purchaseProducts.net_amount)
      ) {
        totalNetAmount += Number.GetFloat(purchaseProducts.get("net_amount"));
      }
      if (
        purchaseProducts.tax_amount &&
        purchaseProducts.tax_amount !== null &&
        !isNaN(purchaseProducts.tax_amount)
      ) {
        totalTaxAmount += Number.GetFloat(purchaseProducts.get("tax_amount"));
      }

      if (
        purchaseProducts.taxable_amount &&
        purchaseProducts.taxable_amount !== null &&
        !isNaN(purchaseProducts.taxable_amount)
      ) {
        totalTaxableAmount += Number.GetFloat(
          purchaseProducts.get("taxable_amount")
        );
      }

      if (
        purchaseProducts.unit_margin_amount &&
        purchaseProducts.unit_margin_amount !== null &&
        !isNaN(purchaseProducts.unit_margin_amount)
      ) {
        totalMarginAmount +=
          Number.GetFloat(purchaseProducts.get("unit_margin_amount")) *
          Number.Get(purchaseProducts.get("quantity"));
      }

      if(Number.isNotNull(purchaseProducts?.statusDetail?.rejected_product) && purchaseProducts?.statusDetail?.rejected_product === Status.REJECTED_PRODUCT_ENABLED){
        if(purchaseProducts.net_amount &&
          purchaseProducts.net_amount !== null &&
          !isNaN(purchaseProducts.net_amount)){
            totalRejectedProductAmount += Number.GetFloat(purchaseProducts.get("net_amount"));
          }
      }

      if(Number.isNotNull(purchaseProducts?.statusDetail?.not_received_product) && purchaseProducts?.statusDetail?.not_received_product === Status.NOT_RECEIVED_PRODUCT_ENABLED){
        if(purchaseProducts.net_amount &&
          purchaseProducts.net_amount !== null &&
          !isNaN(purchaseProducts.net_amount)){
            totalNotReceivedProductAmount += Number.GetFloat(purchaseProducts.get("net_amount"));
          }
      }

    });

    if (validator.isEmpty(pagination)) {
      pagination = true;
    }
    if (Boolean.isTrue(pagination)) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }

    let accountProductData;

    if (Number.isNotNull(vendorId)) {
      accountProductData = await AccountProductModel.findAll({
        where: { account_id: vendorId, company_id: companyId },
      });
    }

    // Get Store list and count
    const purchaseProductList = await PurchaseProduct.findAndCountAll(query);
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

      const accountProductPercentage = accountProductData.find(
        (value) => value.product_id == product_id
      );

      let percentageDiff =
        accountProductPercentage && accountProductPercentage?.margin_percentage
          ? accountProductPercentage?.margin_percentage
          : 0;

      const product_index = { ...productIndex.get() };
      const data = {
        id,
        unit_price: Currency.Get(unit_price),
        product_name: product_index.product_name,
        brand_id: product_index.brand_id,
        quantity: quantity,
        image: product_index.featured_media_url,
        purchase_id: purchase_id,
        product_id: product_id,
        hsn_code: product_index.hsn_code,
        discount_amount: discount_amount,
        tax_percentage: tax_percentage,
        tax_amount: tax_amount,
        price: parseFloat(unit_price) * parseInt(quantity, 10),
        size: product_index.size,
        pack_size: product_index.pack_size,
        brand_name: product_index.brand_name,
        sale_price: product_index.sale_price,
        mrp: product_index.mrp,
        unit: product_index.unit,
        purchase_date: purchaseDetail?.purchase_date,
        purchase_number: purchaseDetail?.purchase_number,
        vendor_name: account?.name,
        net_amount: net_amount,
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
        accountProductPercentage: Currency.Get(
          accountProductPercentage?.margin_percentage
        ),
        percentageDiff: Currency.Get(percentageDiff),
        productStatus: product_index && product_index.status,
      };

      purchaseProductEntry.push(data);
    }
    // //return response
    return res.json(200, {
      totalCount: purchaseProductList.count,
      currentPage: page,
      pageSize,
      data: purchaseProductEntry,
      sort,
      sortDir,
      totalAmount: totalNetAmount,
      totalTaxAmount: totalTaxAmount,
      totalTaxableAmount: totalTaxableAmount,
      totalMarginAmount: Number.GetFloat(totalMarginAmount),
      search,
      totalRejectedProductAmount: totalRejectedProductAmount,
      totalNotReceivedProductAmount: totalNotReceivedProductAmount
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

module.exports = purchaseProductList;
