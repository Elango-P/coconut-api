const {
  productIndex,
  Location,
  status: statusModel,
  ProductInvoiceModel,
  InvoiceModel,
} = require("../db").models;

const DateTime = require("../lib/dateTime");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const DataBaseService = require("../lib/dataBaseService");
const Boolean = require("../lib/Boolean");
const invoiceProduct = new DataBaseService(ProductInvoiceModel);
const ObjectName = require("../helpers/ObjectName");
const Status = require("../helpers/Status");
// Lib
const Request = require("../lib/request");
const ProductPriceService = require("./ProductPriceService");
const Order = require("../helpers/Order");
const statusService = require("./StatusService");
const validator = require("../lib/validator");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");
const Response = require("../helpers/Response");

class invoiceProductService {
  static async search(req, res) {
    try {
      const companyId = Request.GetCompanyId(req);

      const params = req.query;

      let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        location,
        startDate,
        endDate,
        productId,
        orderId,
        category,
        brand,
        status,
        product,
        startTime,
        endTime,
        type,
        excludeCancelledStatus,
      } = params;
      let timeZone = Request.getTimeZone(req);

      let start_date = DateTime.toGetISOStringWithDayStartTime(startDate);
      let end_date = DateTime.toGetISOStringWithDayEndTime(endDate);

      let startTimeValue = DateTime.getGmtHoursAndMinutes(startTime);
      let endTimeValue = DateTime.getGmtHoursAndMinutes(endTime);

      let productDetailWhere = new Object();
      let whereClause = "";

      let where = new Object();

      let orderArray = new Array();

      const orderProductData = new Array();

      let filterProductId = new Array();

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
        store_product_id: "store_product_id",
        name: "name",
        quantity: "quantity",
        vendor: "vendor",
        product_name: "product_name",
        fulfillment_service: "fulfillment_service",
        requires_shipping: "requires_shipping",
        taxable: "taxable",
        grams: "grams",
        price: "price",
        unit_price: "unit_price",
        amount: "amount",
        cost_price: "cost_price",
        profit_amount: "profir_amount",
        total_discount: "total_discount",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        product_display_name: "product_display_name",
        location: "location",
        order_id: "order_id",
        invoice_date: "invoice_date",
        id: "id",
      };

      const sortParam = sort ? sort : "createdAt";
      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort product by ${sortParam}` };
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
      }


      if (excludeCancelledStatus) {
        let statusDetail = await statusService.getAllStatusByGroupId(
          ObjectName.ORDER_PRODUCT,
          null,
          companyId,
          Status.GROUP_CANCELLED
        );
        const statusIdsArray =
          statusDetail &&
          statusDetail.length > 0 &&
          statusDetail.map((status) => status?.id);
        if (statusIdsArray && statusIdsArray.length > 0) {
          where.status = {
            [Op.in]: statusIdsArray,
          };
        }
      }
      //append the company Id
      where.company_id = companyId;
      let invoiceWhere={};
      // Filter by order_id
      if (orderId) {
        invoiceWhere.order_id = orderId;
      }

      if (type) {
        invoiceWhere.type = type;
      }

      if (location) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product.store_id= ${location} `;
        where.store_id = location;
      }

      if (status) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product.status= ${status} `;
        where.status = status;
      }
      if (product) {
        where.product_id = product;
      }

      if (category) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` product_index.category_id = ${category} `;
        productDetailWhere.category_id = category;
      }

      if (brand) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` product_index.brand_id =${brand} `;
        productDetailWhere.brand_id = brand;
      }

      if (productId) {
        where.product_id = productId;
      }

      if (startDate && !endDate) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product."invoice_date" > '${DateTime.toGMT(
          start_date,
          timeZone
        )}' `;

        where.invoice_date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date, timeZone),
          },
        };

        if (startTime) {
          whereClause += ` AND (EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)) > ${
            parseInt(startTimeValue.split(":")[0]) * 60 +
            parseInt(startTimeValue.split(":")[1])
          } `;
          where.createdAt = {
            [Op.and]: {
              [Op.gte]: Sequelize.literal(
                `(EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)) > ${
                  parseInt(startTimeValue.split(":")[0]) * 60 +
                  parseInt(startTimeValue.split(":")[1])
                }`
              ),
            },
          };
        }
        if (endTime) {
          whereClause += ` AND (EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)) < ${
            parseInt(endTimeValue.split(":")[0]) * 60 +
            parseInt(endTimeValue.split(":")[1])
          } `;
          where.createdAt = {
            [Op.and]: {
              [Op.lte]: Sequelize.literal(
                `(EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)) < ${
                  parseInt(endTimeValue.split(":")[0]) * 60 +
                  parseInt(endTimeValue.split(":")[1])
                }`
              ),
            },
          };
        }
      }
      // endDate and endTime
      if (endDate && !startDate) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product."invoice_date" < '${DateTime.toGMT(
          end_date,
          timeZone
        )}' `;
        if (startTime) {
          whereClause += ` AND (EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."invoice_date"::time)) > ${
            parseInt(startTimeValue.split(":")[0]) * 60 +
            parseInt(startTimeValue.split(":")[1])
          } `;
          where.createdAt = {
            [Op.and]: {
              [Op.gte]: Sequelize.literal(
                `(EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)) > ${
                  parseInt(startTimeValue.split(":")[0]) * 60 +
                  parseInt(startTimeValue.split(":")[1])
                }`
              ),
            },
          };
        }
        if (endTime) {
          whereClause += ` AND (EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)) < ${
            parseInt(endTimeValue.split(":")[0]) * 60 +
            parseInt(endTimeValue.split(":")[1])
          } `;
          where.createdAt = {
            [Op.and]: {
              [Op.lte]: Sequelize.literal(
                `(EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 + EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)) < ${
                  parseInt(endTimeValue.split(":")[0]) * 60 +
                  parseInt(endTimeValue.split(":")[1])
                }`
              ),
            },
          };
        }
        where.invoice_date = {
          [Op.and]: {
            [Op.lte]: DateTime.toGMT(end_date, timeZone),
          },
        };
      }
      //startDate endDate and startTime endTime
      if (startDate && endDate) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product."invoice_date" BETWEEN '${DateTime.toGMT(
          start_date,
          timeZone
        )}' AND '${DateTime.toGMT(end_date, timeZone)}' `;
        if (startTime && endTime) {
          whereClause += `
            AND (
              EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 +
              EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)
            ) > ${
              parseInt(startTimeValue.split(":")[0]) * 60 +
              parseInt(startTimeValue.split(":")[1])
            }
            AND (
              EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 +
              EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)
            ) < ${
              parseInt(endTimeValue.split(":")[0]) * 60 +
              parseInt(endTimeValue.split(":")[1])
            }
          `;

          where.createdAt = {
            [Op.and]: [
              Sequelize.literal(`
                (
                  EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 +
                  EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)
                ) > ${
                  parseInt(startTimeValue.split(":")[0]) * 60 +
                  parseInt(startTimeValue.split(":")[1])
                }
                AND
                (
                  EXTRACT(HOUR FROM "invoice_product"."createdAt"::time) * 60 +
                  EXTRACT(MINUTE FROM "invoice_product"."createdAt"::time)
                ) < ${
                  parseInt(endTimeValue.split(":")[0]) * 60 +
                  parseInt(endTimeValue.split(":")[1])
                }
              `),
            ],
          };
        }

        where.invoice_date = {
          [Op.and]: {
            [Op.gte]: DateTime.toGMT(start_date, timeZone),
            [Op.lte]: DateTime.toGMT(end_date, timeZone),
          },
        };
      }
      if (!startDate && !endDate && startTime && !endTime) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product."createdAt" > '${startTime}' `;
        where.createdAt = {
          [Op.and]: {
            [Op.gte]: startTime,
          },
        };
      }
      //endTime
      if (!startDate && !endDate && !startTime && endTime) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product."createdAt" < '${endTime}' `;
        where.createdAt = {
          [Op.and]: {
            [Op.lte]: endTime,
          },
        };
      }
      //startTime and endTime
      if (!startDate && !endDate && startTime && endTime) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` invoice_product."invoice_date" BETWEEN '${startTime}' AND '${endTime}' `;
        where.createdAt = {
          [Op.and]: {
            [Op.gte]: startTime,
            [Op.lte]: endTime,
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

      if (searchTerm && filteredProductIds.length == 0) {
        if (searchTerm && isNaN(Number(searchTerm))) {
          where[Op.or] = [
            {
              "$productIndex.product_display_name$": {
                [Op.iLike]: `%${searchTerm}%`,
              },
            },
          ];
        }
        if (
          typeof Number(searchTerm) == "number" &&
          !isNaN(Number(searchTerm))
        ) {
          where[Op.or] = [
            {
              order_number: {
                [Op.eq]: searchTerm,
              },
            },
          ];
        }
      }

      if (search) {
        if (whereClause) {
          whereClause += " AND ";
        }
        whereClause += ` product_index.product_display_name ILIKE '%${searchTerm}%' `;
      }



      if (sort === "") {
        orderArray.push([sortParam, "DESC"]);
      }
      if (
        sort &&
        sort !== "" &&
        sort !== "product_display_name" &&
        sort !== "location"
      ) {
        orderArray.push([sortParam, sortDirParam]);
      }
      if (sort === "product_display_name") {
        orderArray.push([
          { model: productIndex, as: "productIndex" },
          "product_display_name",
          sortDir,
        ]);
      }
      if (sort === "location") {
        orderArray.push([
          { model: Location, as: "locationDetails" },
          "name",
          sortDir,
        ]);
      }

      const query = {
        distinct: true,
        attributes: {},
        order: orderArray,
        include: [
          {
            required: true,
            model: productIndex,
            as: "productIndex",
            where: productDetailWhere,
          },
          {
            required: true,
            model: InvoiceModel,
            as: "invoiceDetail",
            where:invoiceWhere
          },

          {
            required: false,
            model: Location,
            as: "locationDetails",
          },
          {
            required: false,
            model: statusModel,
            as: "statusDetail",
          },
        ],
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

      // Get order product and count
      const invoiceProducts = await invoiceProduct.findAndCount(query);

      // Return order product is null
      if (invoiceProducts.count === 0) {
        return res.json(Response.OK, {
          totalCount: invoiceProducts.count,
          currentPage: page,
          pageSize,
          data: [],
          sort,
          sortDir,
          search,
        });
      }
      let statusDetail = await statusService.Get(ObjectName.INVOICE_PRODUCT, Status.GROUP_APPROVED, companyId);
      let invoiceProductItem;

      for (let i = 0; i < invoiceProducts.rows.length; i++) {
        invoiceProductItem = null;

        invoiceProductItem = invoiceProducts.rows[i];

        ///Total Price Amount
        orderProductData.push({
          id: invoiceProductItem.invoice_id,
          saleproductInvoiceId: invoiceProductItem.id,
          orderProductId: invoiceProductItem.order_product_id,
          allowRefundRequest : invoiceProductItem?.status == statusDetail?.id ? false:true,
          order_id:
            invoiceProductItem &&
            invoiceProductItem.invoiceDetail &&
            invoiceProductItem.invoiceDetail?.order_id,
          invoice_number: invoiceProductItem.invoice_number,
          product_id: invoiceProductItem.product_id,
          quantity: invoiceProductItem.quantity,
          unit_price: invoiceProductItem.unit_price,
          product_name: invoiceProductItem.productIndex?.product_name
            ? invoiceProductItem.productIndex?.product_name
            : "",
          brand_name: invoiceProductItem.productIndex?.brand_name
            ? invoiceProductItem.productIndex?.brand_name
            : "",
          size: invoiceProductItem.productIndex?.size
            ? invoiceProductItem.productIndex?.size
            : "",
          unit: invoiceProductItem.productIndex?.unit
            ? invoiceProductItem.productIndex?.unit
            : "",
          price: invoiceProductItem.price,
          store_id: invoiceProductItem.store_id,
          productDetails: invoiceProductItem.productIndex,
          image: invoiceProductItem.productIndex?.featured_media_url
            ? invoiceProductItem.productIndex?.featured_media_url
            : "",
          createdAt: DateTime.defaultDateFormat(invoiceProductItem.createdAt),
          updatedAt: DateTime.defaultDateFormat(invoiceProductItem.updatedAt),
          orderDate: invoiceProductItem.invoice_date
            ? DateTime.getDateTimeByUserProfileTimezone(invoiceProductItem.invoice_date,timeZone)
            : "",
          locationName: invoiceProductItem.locationDetails?.name,
          amount: invoiceProductItem.price,
          status:
            invoiceProductItem.statusDetail &&
            invoiceProductItem.statusDetail?.name,
          allowEdit:
            invoiceProductItem.statusDetail &&
            invoiceProductItem.statusDetail?.allow_edit,
          colourCode:
            invoiceProductItem.statusDetail &&
            invoiceProductItem.statusDetail?.color_code,
            currentStatusId: invoiceProductItem.status,
          cost_price: invoiceProductItem.cost_price
            ? invoiceProductItem.cost_price
            : "",
          profit_amount: invoiceProductItem.profit_amount
            ? invoiceProductItem.profit_amount
            : "",
          mrp: invoiceProductItem.mrp,
          brand_id: invoiceProductItem.productIndex?.brand_id,
          sgst_amount: invoiceProductItem.sgst_amount,
          cgst_amount: invoiceProductItem.cgst_amount,
          cancelledAt: invoiceProductItem.cancelled_at,
          allowCancel:
            invoiceProductItem.statusDetail &&
            invoiceProductItem.statusDetail?.allow_cancel == Status.ALLOW_CANCEL
              ? true
              : false,
          manual_price: invoiceProductItem.manual_price,
        });
        filterProductId.push(Number(invoiceProductItem.product_id));
      }

      // order product search where
      if (search) {
        where.product_id = { [Op.in]: filterProductId };
      }

      return res.json(Response.OK, {
        totalCount: invoiceProducts.count,
        currentPage: page,
        pageSize,
        data: orderProductData,
        sort,
        sortDir,
        search,
      });
    } catch (err) {
      console.log(err);
      return res.json(Response.BAD_REQUEST, { message: err.message });
    }
  }
  static async updateStatus(id, data, companyId) {

    try{
      let response = await invoiceProduct.update({ status: data?.status }, { where: { id:id , company_id:companyId} });

      return response
    }catch(err){
      console.log(err);
    }
  }
}

module.exports = invoiceProductService;
