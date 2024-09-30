const { Op } = require('sequelize');
const ObjectName = require('../helpers/ObjectName');
const PurchaseOrderProduct = require('../helpers/PurchaseOrderProduct');
const { BAD_REQUEST, CREATE_SUCCESS } = require('../helpers/Response');
const DateTime = require('../lib/dateTime');
const Request = require('../lib/request');
const History = require('./HistoryService');
const Boolean = require("../lib/Boolean");
const validator = require('../lib/validator');
const Numbers = require("../lib/Number");

const { purchaseOrderProductModal, productIndex, AccountProductModel, status } = require('../db').models;

const create = async (req, res) => {
  try {
    const data = req.body;

    const companyId = Request.GetCompanyId(req);
    let ids = data.productIds.split(',');

    if (ids.length === 0 || ids[0] === '') {
      return res.json(BAD_REQUEST, { message: 'Product is Required' });
    }

    let where = {};

    where.company_id = companyId;

    where.product_id = { [Op.in]: ids };

    where.account_id = data.vendorId;

    const query = {
      attributes: { exclude: ['deletedAt'] },
      where,
    };

    let productIdsToLog = [];
    let createDataList = [];

    if (ids.length > 0) {
      const vendorProducts = await AccountProductModel.findAll(query);
      for (const product of vendorProducts) {
        createDataList.push({
          product_id: product.product_id,
          purchase_order_id: data.purchaseOrderId || data.purchase_order_id,
          status: PurchaseOrderProduct.STATUS_NEW_VALUE,
          company_id: companyId,
        });
        productIdsToLog.push(product.product_id);
      }
    } else {
      createDataList.push({
        product_id: data.productIds,
        purchase_order_id: data.purchaseOrderId || data.purchase_order_id,
        status: PurchaseOrderProduct.STATUS_NEW_VALUE,
        company_id: companyId,
      });
      productIdsToLog.push(data.productIds);
    }

    // Bulk create data
    await purchaseOrderProductModal.bulkCreate(createDataList);

    const message = `${productIdsToLog.join(',')} - Purchase Order Product Added`;

    res.on('finish', async () => {
      await History.create(message, req, ObjectName.PURCHASE_ORDER, data?.purchaseOrderId);
    });
    res.json(CREATE_SUCCESS, { message: 'Product added' });
  } catch (err) {
    console.log(err);
    res.json(BAD_REQUEST, { message: err.message });
  }
};

const search = async (req, res) => {
  try {
    //get req params
    let params = req.query;

    //destructure the params
    let { page, pageSize, search, sort, sortDir, pagination, purchaseOrderId } = params;


    //get company Id from request
    const companyId = Request.GetCompanyId(req);

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      throw {
        message: 'Invalid page',
      };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      throw {
        message: 'Invalid page size',
      };
    }

    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      product_id: 'product_id',
      brand_name: 'brand_name',
      quantity: 'quantity',
      price: 'price',
      amount: 'amount',
      status: 'status',
      product_name: 'product_name',
    };

    const sortParam = sort || 'product_name';
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, {
        message: `Unable to sort product by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, {
        message: 'Invalid sort order',
      });
    }

    //cretae where object
    let where = new Object();

    //get product details object
    let productDetailWhere = new Object();

    if (purchaseOrderId) {
      where.purchase_order_id = purchaseOrderId;
    }

    //append the company id
    where.company_id = companyId;

    // Search term
    const searchTerm = search ? search.trim() : null;

    //validate search term
    if (searchTerm) {
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
        {
          category_name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const include = [
      {
        required: true,
        model: productIndex,
        as: 'productDetails',
        where: productDetailWhere,
      },
      {
        required: false,
        model: status,
        as: 'statusDetail',
      },
    ];

    //create query object
    const query = {
      order: [
        sortParam === 'product_name'
          ? [{ model: productIndex, as: 'productDetails' }, 'product_name', sortDirParam]
          : sortParam === 'brand_name'
          ? [{ model: productIndex, as: 'productDetails' }, 'brand_name', sortDirParam]
          : [[sortableFields[sortParam], sortDirParam]],
      ],
      include,
      where,
    };

    const totalAmountQuery = {
      // order: [
      //   sortParam !== 'brand_name'
      //     ? [[sortableFields[sortParam], sortDirParam]]
      //     : [{ model: productIndex, as: 'productDetails' }, 'brand_name', sortDirParam],
      // ],
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

    let totalAmount = 0;

    // Get Purchase count
    const purchaseOrderProduct = await purchaseOrderProductModal.findAndCountAll(totalAmountQuery);

    purchaseOrderProduct.rows.forEach((purchaseOrderProducts) => {
      totalAmount += Number(purchaseOrderProducts.get('amount'));
    });

    //create saleProduct array
    let productData = [];
    const purchaseOrderProducts = await purchaseOrderProductModal.findAndCountAll(query);
    //loop the purchaseOrderProduct
    purchaseOrderProducts.rows.forEach((purchaseProducts) => {
      const {
        id,
        quantity,
        unit_price,
        productDetails,
        createdAt,
        updatedAt,
        product_id,
        purchase_order_id,
        item,
        amount,
        status,
        statusDetail
      } = purchaseProducts;

      const dateTime = new DateTime();

      let product_index = { ...productDetails.get() };

      const data = {
        id,
        unit_price: unit_price,
        product_name: product_index.product_name,
        quantity: quantity,
        image: product_index.featured_media_url,
        product_id: product_id,
        pack_size: product_index.pack_size,
        purchase_order_id: purchase_order_id,
        brand_name: product_index.brand_name,
        brand_id: product_index.brand_id,
        sale_price: product_index.sale_price,
        mrp: product_index.mrp,
        unit: product_index.unit,
        item: item,
        amount: amount,
        size: product_index.size,
        statusId:status,
        status:statusDetail && statusDetail.name,
        statusColor:statusDetail && statusDetail.color_code 
      };
      // Formate Object Property
      (data.createdAt = createdAt), dateTime.formats.shortMonthDateAndTime;
      (data.updatedAt = updatedAt), dateTime.formats.shortMonthDateAndTime;

      productData.push(data);
    });
    //return response
    return res.json(200, {
      totalCount: purchaseOrderProduct.count,
      currentPage: page,
      pageSize,
      data: productData,
      sort,
      sortDir,
      totalAmount,
    });
  } catch (err) {
    console.log(err);
    return res.json(400, {
      message: err.message,
    });
  }
};

const update = async (req, res) => {
    let { id } = req.params;

    try {
    //get Purchase Order product Id
    //get quantity
    const { quantity, product_id } = req.body;

    let productId = product_id;

    //get company Id from request
    const companyId = Request.GetCompanyId(req);

    //validate Purchase Order product Id exist or not
    if (!id) {
      return res.json(400, {
        message: 'Purchase Order Product Id is required',
      });
    }

    //validate Purchase Order product exist or not
    let purchaseProductDetail = await purchaseOrderProductModal.findOne({
      where: { company_id: companyId, id: id },
    });

    

    //validate Purchase Order product exist or not
    if (!purchaseProductDetail) {
      return res.json(400, { message: 'Purchase Order Product Not Found' });
    }

    const amount = Number(purchaseProductDetail.get('unit_price')) * Number(quantity);

    await purchaseOrderProductModal.update(
      { quantity: quantity, amount: amount },
      { where: { company_id: companyId, id: id } }
    );

    res.on('finish', async () => {

      if (Numbers.Get(purchaseProductDetail.quantity) !== Numbers.Get(quantity)) {
        await History.create(
          `${productId} - Quantity updated to ${quantity}`,
          req,
          ObjectName.PURCHASE_ORDER,
          purchaseProductDetail.purchase_order_id
        );
      }
    });

    return (
      res.json(200, {
        message: 'Purchase Order Product Updated',
      })
    );
  } catch (err) {
    console.log(err);
        return res.json(400, { message: err.message });
  }
};
const updateByStatus = async (req, res, next) => {
  let companyId = Request.GetCompanyId(req);

  let data = req.body;

  let { id } = req.params;
  const PurchaseOrderStatus = await purchaseOrderProductModal.findOne({ where: { company_id: companyId, id: id } });

  const { status } = PurchaseOrderStatus;

  let company_id = Request.GetCompanyId(req);
  try {
    if (!id) {
      return res.json(400, {
        message: 'Invalid Id',
      });
    }

    let updateData = {};
    if (data.status) updateData.status = data.status;

    await purchaseOrderProductModal.update(updateData, {
      where: {
        id,
        company_id,
      },
    });

    // systemLog
    res.json(200, {
      message: 'Purchase Order Product Status Updated',
    });

    res.on('finish', async () => {
      //create system log for product updation
      History.create("StockEntry deleted", req, ObjectName.STOCK_ENTRY, stockEntryId);
    });
  } catch (err) {
    next(err);
    console.log(err);
    res.json(BAD_REQUEST, {
      message: err.message,
    });
  }
};

const del = async (req, res, next) => {
    const id = req.params.id;
    try {
    const company_id = Request.GetCompanyId(req);
    await purchaseOrderProductModal.destroy({ where: { id: id, company_id: company_id } });

    res.json(200, { message: 'Purchase Order Product Deleted' });

    res.on('finish', async () => {
      //create system log for sale updation
      History.create("Purchase Order Product Deleted", req, ObjectName.PURCHASE_ORDER, id);
    });
  } catch (err) {
    console.log(err);
      return res.json(400, { message: err.message });
  }
};

module.exports = {
  create,
  search,
  update,
  updateByStatus,
  del,
};
