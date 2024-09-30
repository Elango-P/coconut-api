"use strict";

let Request = require("../../lib/request"); // Models


let _require$models = require("../../db").models,
    SaleProduct = _require$models.SaleProduct,
    product = _require$models.product,
    storeProduct = _require$models.storeProduct;

let create = function create(req, res) {
  let body, quantity, company_id, query, ProductData, ProductNumber, ProductNumberData, companyId, storeProductId, StoreProductDetails, productDetails, SaleProductCreateData, SaleProductDetails;
  return regeneratorRuntime.async(function create$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          //get company Id from request
          body = req.body; //validate sale entry ID exist or not

          if (!body.saleId) {
            res.json(400, {
              message: "saleID Id is required"
            });
          } //get quantity from body


          quantity = body && body.quantity ? parseInt(body.quantity) : null;
          company_id = Request.GetCompanyId(req);
          query = {
            order: [["createdAt", "DESC"]],
            where: {
              company_id: company_id
            },
            attributes: ["item"]
          };
          _context.next = 8;
          return regeneratorRuntime.awrap(SaleProduct.findOne(query));

        case 8:
          ProductData = _context.sent;
          ProductNumberData = ProductData && ProductData.get("item");

          if (!ProductNumberData) {
            ProductNumber = 1;
          } else {
            ProductNumber = ProductNumberData + 1;
          }

          companyId = Request.GetCompanyId(req);
          storeProductId = body.storeProductId;
          _context.next = 15;
          return regeneratorRuntime.awrap(storeProduct.findOne({
            where: {
              id: storeProductId
            }
          }));

        case 15:
          StoreProductDetails = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(product.findOne({
            where: {
              id: StoreProductDetails.product_id,
              company_id: companyId
            }
          }));

        case 18:
          productDetails = _context.sent;
          //create sale product entry create data
          SaleProductCreateData = {
            name: productDetails.name,
            company_id: companyId,
            sale_id: body.saleId,
            product_id: body.storeProductId,
            quantity: quantity,
            item: ProductNumber,
            cost_price: productDetails.cost,
            unit_price: productDetails.sale_price,
            mrp: productDetails.mrp,
            tax: productDetails.tax,
            price: Number(productDetails.sale_price) * Number(quantity),
            profit: (Number(productDetails.sale_price) - Number(productDetails.cost)) * Number(quantity)
          }; //create sale entry

          _context.next = 22;
          return regeneratorRuntime.awrap(SaleProduct.create(SaleProductCreateData));

        case 22:
          SaleProductDetails = _context.sent;
          //return response
          res.json(200, {
            message: "Sale Product Added",
            SaleProductDetails: SaleProductDetails
          });
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.json(400, {
            message: _context.t0.message
          }));

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 26]]);
};

module.exports = create;