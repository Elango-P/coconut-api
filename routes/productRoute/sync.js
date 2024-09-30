const { Op } = require('sequelize');

// Status
const { BAD_REQUEST } = require("../../helpers/Response");
const DateTime = require("../../lib/dateTime");

// Lib
const Request = require("../../lib/request");

// Constants

const { productIndex, ProductPrice } = require("../../db").models;

const Number = require("../../lib/Number");

/**
 * Product get route by product id
 */
async function sync(req, res, next) {
    try {

        const { barCode, productId, } = req.query;

        const productList = [];

        const priceList = [];

        let productIds = [];

        let companyId = Request.GetCompanyId(req);

        let productWhere = {};

        let productPriceWhere = {};

        if (barCode) {
            productPriceWhere.barcode = barCode;
        }

        if (productId) {
            productPriceWhere.product_id = productId;
            productWhere.product_id = productId;
        }

        productWhere.company_id = companyId;

        productPriceWhere.company_id = companyId;

        const productPriceList = await ProductPrice.findAll({ where: productPriceWhere });

        if (productPriceList && productPriceList.length > 0) {
            
            for (let i = 0; i < productPriceList.length; i++) {
                const {
                    id,
                    quantity,
                    unit_price,
                    product_id,
                    item,
                    amount,
                    mrp,
                    barcode,
                    cost_price,
                    sale_price,
                    is_default,
                    company_id,
                } = productPriceList[i];


                const data = {
                    id,
                    unit_price: unit_price,
                    quantity: quantity,
                    product_id: product_id,
                    item: item,
                    amount: amount,
                    mrp: Number.GetFloat(mrp),
                    costPrice: Number.GetFloat(cost_price),
                    barCode: barcode,
                    salePrice: Number.GetFloat(sale_price),
                    companyId: company_id,
                    isDefault: is_default == ProductPrice.IS_DEFAULT ? true : false
                };

                priceList.push(data);

                if (barCode && productIds.indexOf(product_id) == -1) {
                    productIds.push(product_id);
                }
            }
        }

        if (barCode && productIds.length > 0) {
            productWhere.product_id = { [Op.in]: productIds };
        }

        if ((barCode && productIds.length > 0) || !barCode || productId) {
            
            let products = await productIndex.findAll({ where: productWhere });

            if (products && products.length > 0) {

                for (let i = 0; i < products.length; i++) {
                    const {
                        product_id,
                        product_name,
                        size,
                        unit,
                        sale_price,
                        brand_name,
                        category_name,
                        brand_id,
                        category_id,
                        status,
                        featured_media_url,
                        max_quantity,
                        min_quantity,
                        quantity,
                        mrp,
                        cost,
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
                        cgst_amount,
                        sgst_amount,
                        productPrice
                    } = products[i];

                    const product = {
                        id: product_id,
                        name: product_name,
                        brand: brand_name,
                        brand_id: brand_id,
                        category_id: category_id,
                        size: size,
                        unit: unit,
                        cost: cost,
                        category: category_name,
                        sale_price: Number.GetFloat(sale_price),
                        image: featured_media_url,
                        mrp: Number.GetFloat(mrp),
                        tax_percentage: tax_percentage,
                        barCode,
                        featured_media_url: image,
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
                        manufacture: manufacture,
                        cgst_amount: cgst_amount,
                        sgst_amount: sgst_amount,
                        productPrice: productPrice,
                        createdAt: DateTime.defaultDateFormat(createdAt),
                        updatedAt: DateTime.defaultDateFormat(updatedAt)
                    };

                    productList.push(product);
                }
            }
        }

        res.json({
            productList: productList,
            priceList: priceList
        });

    } catch (err) {
        console.log(err);
        res.json(BAD_REQUEST, { message: err.message });
    }

};
module.exports = sync;
