// Utils
const { getMediaUrl } = require("../../lib/utils");

// Status
const { BAD_REQUEST } = require("../../helpers/Response");
const DateTime = require("../../lib/dateTime");

// Lib
const Request = require("../../lib/request");

// Constants

const { productIndex } = require("../../db").models;

const Product = require("../../helpers/Product");


const Number = require("../../lib/Number");


async function list(req, res, next) {

  try {
    let {
      baseUrl,
      category
    } = req.query;

   
    let companyId = await Request.GetCompanyIdBasedUrl(baseUrl);
    const where = {};

    where.company_id = companyId;

    if (category) {
      where.category_name = category;
  }
    
    const query = {
      distinct: true,
      order:[["product_name","ASC"]],
      where,
    };


    await productIndex.findAndCountAll(query).then((products) => {
      // Return products is null
      if (products.count === 0) {
        return res.json({});
      }
      const data = [];
      products.rows.forEach((productDetails) => {
        const {
          product_id,
          product_name,
          size,
          unit,
          brand_name,
          category_name,
          brand_id,
          category_id,
          status,
          featured_media_url,
          max_quantity,
          min_quantity,
          quantity,
          tax_percentage,
          image,
          product_display_name,
          createdAt,
          updatedAt,
          profit_amount,
          profit_percentage,
          allow_transfer_out_of_stock,
          allow_sell_out_of_stock,
          product_media_id,
          company_id,
          hsn_code,
          pack_size,
          print_name,
          cgst_percentage,
          sgst_percentage,
          igst_percentage,
          product_price_id,
          manufacture,
          manufacture_name,
          cgst_amount,
          sgst_amount
        } = productDetails;

        const product = {
          id: product_id,
          name: product_name,
          brand: brand_name,
          brand_id: brand_id,
          category_id: category_id,
          size: size,
          unit: unit,
          category: category_name,
          image: featured_media_url,
          tax_percentage: tax_percentage,
          featured_media_url: image,
          status:
            status == Product.STATUS_ACTIVE
              ? Product.STATUS_ACTIVE_TEXT
              : status === Product.STATUS_DRAFT
                ? Product.STATUS_DRAFT_TEXT
                : Product.STATUS_INACTIVE_TEXT,
          statusValue: status,
          quantity: quantity,
          min_quantity: min_quantity,
          max_quantity: max_quantity,
          product_display_name: product_display_name,
          profit_amount: profit_amount,
          profit_percentage: profit_percentage,
          cgst_percentage: cgst_percentage,
          sgst_percentage: sgst_percentage,
          igst_percentage: igst_percentage,
          allow_transfer_out_of_stock: allow_transfer_out_of_stock,
          allow_sell_out_of_stock: allow_sell_out_of_stock,
          product_media_id: product_media_id,
          company_id: company_id,
          hsn_code: hsn_code,
          pack_size: pack_size,
          print_name: print_name,
          product_price_id: product_price_id,
          manufacture:manufacture,
          cgst_amount:cgst_amount,
          sgst_amount:sgst_amount,
          manufacture_name:manufacture_name,
        };

        product.createdAt = DateTime.defaultDateFormat(createdAt);
        product.updatedAt = DateTime.defaultDateFormat(updatedAt);
        data.push(product);
      });

      res.json({
        data: data ? data : [],
      });
    });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
}
module.exports = list;
