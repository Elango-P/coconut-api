const { Sequelize, Op } = require("sequelize");
const Response = require("../helpers/Response");
const DataBaseService = require("../lib/dataBaseService");
const Number = require("../lib/Number");
const DateTime = require("../lib/dateTime");
const { AccountProductModel, productIndex, PurchaseProduct, Purchase, account } = require("../db").models;
const AccountProduct = new DataBaseService(AccountProductModel);
const validator = require("../lib/validator");
const Boolean = require("../lib/Boolean");
const ProductPriceService = require("../services/ProductPriceService");
const ObjectName = require("../helpers/ObjectName");
const History = require("./HistoryService");


class AccountProductService {
  static async createProduct(data) {
    try {
      if (!data) {
        throw { message: "Account product details is required" };
      }
      let accountDetail = await AccountProduct.findOne({
        where: {
          product_id: data.productId,
          company_id: data.company_id,
          account_id: data.accountId,
        },
      });

      if (!accountDetail) {
        const createData = {
          product_id: data.productId,
          company_id: data.company_id,
          account_id: data.accountId,
        };

        const accountProductDetail = await AccountProduct.create(createData);
        return accountProductDetail;
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async create(req, res, next) {
    const data = req.body;
    const companyId = req.user && req.user.company_id;
    try {
      if (data.productIds == "") {
        return res.json(Response.BAD_REQUEST, { message: "Product is Required" });
      }
      let ids = [];
      if (req.body.productIds.includes(",")) {
        ids = req.body.productIds.split(",");
        for (let index = 0; index < ids.length; index++) {
          const id = ids[index];
          const createData = {
            productId: id,
            company_id: companyId,
            accountId: data.vendorId,
          };
          await this.createProduct(createData);
        }
      } else {
        const createData = {
          productId: data.productIds,
          company_id: companyId,
          accountId: data.vendorId,
        };
        await this.createProduct(createData);
      }

      res.json(Response.CREATE_SUCCESS, { message: "Products added" });
    } catch (err) {
      res.json(Response.BAD_REQUEST, { message: err.message });
    }
  }

  static async del(req, res, next) {
    try {
      const id = req.params.id;
      const companyId = req.user && req.user.company_id;

      // Validate id exist or not
      if (!id) {
        return res.json(400, { message: "Account Product is Not Found" });
      }

      await AccountProduct.delete({ where: { id: id, company_id: companyId } });

      res.json(200, { message: "Account Product Deleted" });
    } catch (err) {
      console.log(err);
      return res.json(400, { message: err.message });
    }
  }

  static async search(params, companyId) {
    try {
      let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        accountId,
        product_id,
        code,
        status,
      } = params;

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
        product_id: "product_id",
        name: "product_display_name",
        account_id: "account_id",
        margin_percentage: "margin_percentage",
        cost_price: "cost_price",
      };

      const sortParam = sort ? sort : "account_id";

      // Validate sortable fields is present in sort param
      if (!Object.keys(sortableFields).includes(sortParam)) {
        throw { message: `Unable to sort by ${sortParam}` };
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "ASC";

      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        throw { message: "Invalid sort order" };
      }

      let where = {};

      let productWhere = new Object();

      where.company_id = companyId;
      // Search term
      const searchTerm = search ? search.trim() : null;

      let filteredProductIds = await ProductPriceService.getProductIds(searchTerm, companyId)
      if (filteredProductIds && filteredProductIds.length > 0) {
        productWhere.product_id = filteredProductIds
      }
      if (searchTerm) {
        where[Op.or] = [
          {
            "$accountDetail.name$": {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            "$productIndex.product_display_name$": {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },

        ];
      }

      if (params.brand) {
        productWhere.brand_id = params.brand.split(",");
      }
      if (params.category) {
        productWhere.category_id = params.category.split(",");
      }
      // Search by product id
      if (accountId) {
        where.account_id = accountId;
      }
      if (product_id) {
        where.product_id = product_id;
      }

      // Search by store id
      if (params.vendor_id) {
        where.vendor_id = params.vendor_id;
      }

      const order = [];

       if (sortParam == "name") {
        order.push([{ model: productIndex, as: "productIndex" }, "product_display_name", sortDirParam]);
      } else if(sortParam == "cost_price"){
        order.push([{ model: productIndex, as: "productIndex" }, "cost", sortDirParam]);
      } else {
        const nullsPlacement = sortDirParam === "DESC" ? "NULLS LAST" : "NULLS FIRST";

        order.push([Sequelize.literal(`${sortParam} ${sortDirParam} ${nullsPlacement}`)]);
      }

      const accountDetailWhere = {};
      if (status) {
        accountDetailWhere.status = status;
      }

      const query = {
        distinct: true,
        where,
        order: order,
        include: [
          {
            required: true,
            model: productIndex,
            as: "productIndex",
            where: productWhere,
          },
          {
            required: true,
            model: account,
            as: "accountDetail",
            where: accountDetailWhere,
          },
        ],
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
      // Get store list and count
      const list = await AccountProductModel.findAndCountAll(query);

      // Return store is null
      if (list.count === 0) {
        return { data: [] };
      }

      const data = [];

      if (list && list.count > 0) {
        list.rows.forEach((value) => {
          let response = {
            id: value && value.id,
            name: value && value.productIndex && value.productIndex.product_name,
            size: value && value.productIndex && value.productIndex.size,
            unit: value && value.productIndex && value.productIndex.unit,
            brand_name: value && value.productIndex && value.productIndex.brand_name,
            brand_id: value && value.productIndex && value.productIndex.brand_id,
            pack_size: value && value.productIndex && value.productIndex.pack_size,
            sale_price: value && value.productIndex && value.productIndex.sale_price,
            mrp: value && value.productIndex && value.productIndex.mrp,
            image: value && value.productIndex && value.productIndex.featured_media_url,
            vendorName: value && value.accountDetail && value.accountDetail.name,
            vendorId: value && value.accountDetail && value.accountDetail.id,
            margin_percentage: value.margin_percentage,
            product_id: value && value.productIndex && value.productIndex.product_id,
            status: value && value.productIndex && value.productIndex.status,
            cost_price:  value && value.productIndex && value.productIndex.cost
          };
          data.push(response);
        });
      }
      return {
        totalCount: list.count,
        currentPage: page,
        pageSize,
        data,
        sort,
        sortDir,
        search,
      };
    } catch (err) {
      console.log(err);
    }
  }

  static async bulkUpdate(req, res) {
    const companyId = Request.GetCompanyId(req);
    const data = req.body;
    let accountProductIds = data && data?.ids;

    try {
      const updateData = {};

      if (data?.margin_percentage) {
        updateData.margin_percentage = Number.GetFloat(data?.margin_percentage);
      }

      for (let i = 0; i < accountProductIds.length; i++) {
        const id = accountProductIds[i];

        await AccountProduct.update(updateData, {
          where: { id: id, company_id: companyId },
        });
      }
      res.json(Response.CREATE_SUCCESS, { message: "Account Product Bulk updated" });
    } catch (err) {
      res.json(Response.BAD_REQUEST, { message: err.message });
    }
  }

  static async addFromPurchase(params, companyId) {
    try {
      let where = {};

      where.company_id = companyId;

      if (params && params.account_id) {
        where.vendor_id = params.account_id;
      }

      let purchaseData = await Purchase.findAll({ where: where });

      if (purchaseData && purchaseData.length == 0) {
        throw { message: "Purchase not found" };
      }

      let purchaseIds = purchaseData.map((value) => value.id);

      let productWhere = {};

      if (purchaseIds && purchaseIds.length > 0) {
        productWhere.purchase_id = { [Op.in]: purchaseIds };
      }

      const products = await PurchaseProduct.findAll({
        order: [["createdAt", "DESC"]],
        attributes: ["product_id", "purchase_id", "margin_percentage", "unit_price"],
        where: productWhere
      });

      if (products && products.length == 0) {
        throw { message: "Product not found" };
      }

      let purchaseProductData = [];

      if (products && products.length > 0) {
        for (let i = 0; i < products.length; i++) {
          purchaseProductData.push({
            product_id: products[i].product_id,
            purchase_id: products[i].purchase_id,
            margin_percentage: products[i].margin_percentage,
            unit_price: products[i].unit_price,
          });
        }
      }

      let accountProductData;

      if (purchaseProductData && purchaseProductData.length > 0) {
        for (let i = 0; i < purchaseProductData.length; i++) {
          try {
            accountProductData = await AccountProductModel.findOne({
              where: {
                company_id: companyId,
                product_id: purchaseProductData[i].product_id,
                account_id: params.account_id,
              },
              attributes: ["id"],
            });

            if (!accountProductData) {
              await AccountProductModel.create({
                company_id: companyId,
                product_id: purchaseProductData[i].product_id,
                account_id: params.account_id,
                margin_percentage: Number.GetFloat(purchaseProductData[i]?.margin_percentage),
              });
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async update(params, companyId) {
    try {
      const updateData = {};

      updateData.margin_percentage = Number.GetFloat(params.margin_percentage);

      await AccountProduct.update(updateData, {
        where: {
          id: params.id,
          company_id: companyId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = AccountProductService;
