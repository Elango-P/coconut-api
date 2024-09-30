const DateTime = require('../lib/dateTime');
const History = require('./HistoryService');
const errors = require('restify-errors');
const Request = require('../lib/request');
const PurchaseOrder = require('../helpers/PurchaseOrder');
const { Op, Sequelize } = require('sequelize');
const ObjectName = require('../helpers/ObjectName');
const {
  purchaseOrderModal,
  purchaseOrderProductModal,
  productIndex,
  account: accountModal,
  vendorProduct,
  AddressModel,
  AccountProductModel,
  status: statusModel,
  storeProduct,
  User,
} = require('../db').models;
const DataBaseService = require('../lib/dataBaseService');
const addressService = new DataBaseService(AddressModel);
const statusService = new DataBaseService(statusModel);
const accountService = new DataBaseService(accountModal);
const purchaseOrderService = new DataBaseService(purchaseOrderModal);
const purchaseOrderProductService = new DataBaseService(purchaseOrderProductModal);
const vendorProductService = new DataBaseService(vendorProduct);
const Numbers = require('../lib/Number');
const Response = require('../helpers/Response');
const String = require('../lib/string');
const Boolean = require('../lib/Boolean');
const validator = require('../lib/validator');
const { getSettingValue } = require('./SettingService');
const Location = require('../helpers/Location');
const PurchaseOrderProduct = require('../helpers/PurchaseOrderProduct');
const StatusService = require("../services/StatusService");

const search = async (req, res, next) => {
  try {
    let { page, pageSize, search, sort, sortDir, status, account, objectName, pagination, startDate, endDate, vendor } =
      req.query;
    const company_id = Request.GetCompanyId(req);
    const where = {};

    where.company_id = company_id;

    if (account) {
      where.vendor_id = account;
    }
    if (status) {
      where.status = status;
    }
    if (startDate && !endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    };
    if (Numbers.isNotNull(vendor)) {
      where.vendor_id = vendor;
    }

    if (!startDate && endDate) {
      where.date = {
        [Op.and]: {
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    };

    if (startDate && endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    };
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(Response.BAD_REQUEST, {
        message: 'Invalid page',
      });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(Response.BAD_REQUEST, {
        message: 'Invalid page size',
      });
    }

    if (page && pageSize) {
      // Validate if page is not a number
      page = page ? parseInt(page, 10) : 1;
      if (isNaN(page)) {
        return res.json(Response.BAD_REQUEST, {
          message: 'Invalid page',
        });
      }

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.json(Response.BAD_REQUEST, {
          message: 'Invalid page size',
        });
      }
    }
    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      date: 'date',
      amount: 'amount',
      vendor_id: 'vendor_id',
      vendor_name: 'name',
      status: 'status',
      purchase_order_number: 'purchase_order_number',
      createdAt: 'createdAt',
      delivery_date: 'delivery_date',
      owner_name: 'name',
      description: 'description',
      id: "id",
    };
    const sortParam = sort || 'createdAt';

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(Response.BAD_REQUEST, {
        message: `Unable to sort data by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(Response.BAD_REQUEST, {
        message: 'Invalid sort order',
      });
    }

    page = page ? parseInt(page, 10) : 1;

    pageSize = pageSize ? parseInt(pageSize, 10) : 25;

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          '$account.name$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    let order = [];
    if (sort === "vendor_name") {
      order.push(
        [{ model: accountModal, as: 'account' }, 'name', sortDirParam]
      )
    }

    if (sort === "owner_name") {
      order.push(
        [{ model: User, as: 'userDetail' }, 'name', sortDirParam]
      )
    }

    if (sort !== "vendor_name" && sort !== "owner_name" && sort) {
      order.push([sortParam, sortDirParam])
    }

    const query = {
      order,
      include: [
        {
          required: true,
          model: accountModal,
          as: 'account',
        },
        {
          required: false,
          model: statusModel,
          as: 'statusDetail',
        },
        {
          required: false,
          model: User,
          as: 'userDetail',
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

    const purchaseOrderData = await purchaseOrderService.findAndCount(query);

    let data = [];
    for (let i = 0; i < purchaseOrderData.rows.length; i++) {
      const {
        id,
        purchase_order_number,
        date,
        delivery_date,
        billing_address_id,
        delivery_address_id,
        statusDetail,
        account,
        description,
        owner_id,
        userDetail,
      } = purchaseOrderData.rows[i];

      const amountvalue = await purchaseOrderProductService.find({
        where: { purchase_order_id: id, company_id: company_id },
      });
      let totalAmount = 0;

      for (let i = 0; i < amountvalue.length; i++) {
        const { amount } = amountvalue[i];
        totalAmount += Number(amount);
      }
      data.push({
        id: id,
        vendor_name: account.name,
        vendorId: account.id,
        date: date,
        amount: totalAmount,
        billingAddress: billing_address_id,
        deliveryAddress: delivery_address_id,
        status: statusDetail?.name,
        purchase_order_number: purchase_order_number,
        delivery_date: delivery_date,
        description: description,
        owner_id: owner_id,
        owner_name: String.concatName(userDetail?.name, userDetail?.last_name),
        image: userDetail && userDetail?.media_url,
        statusColor: statusDetail?.color_code,
      });
    }

    res.json({
      totalCount: purchaseOrderData.count,
      currentPage: page,
      pageSize,
      search,
      data,
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

const create = async (req, res, next) => {
  try {
    //get company Id from request
    let body = req.body;
    const company_id = Request.GetCompanyId(req);

    //validate store Id exist or not
    if (!body.vendor_id) {
      return res.json(Response.BAD_REQUEST, { message: 'Vendor Is Required' });
    }
    let query = {
      order: [['createdAt', 'DESC']],
      where: { company_id },
      attributes: ['purchase_order_number', 'vendor_id', 'date', 'deletedAt', 'createdAt', 'status', 'id'],
    };

    let lastpurchaseOrderData = await purchaseOrderService.findOne(query);

    let purchase_order_number;
    let purchaseOrderNumberData = lastpurchaseOrderData && lastpurchaseOrderData.purchase_order_number;
    if (!purchaseOrderNumberData) {
      purchase_order_number = 1;
    } else {
      purchase_order_number = purchaseOrderNumberData + 1;
    }
    
    //create stock create object
    let CreateData = {
      company_id,
      status: await StatusService.getFirstStatus(ObjectName.PURCHASE_ORDER, company_id),
      vendor_id: body.vendor_id,
      date: DateTime.UTCtoLocalTime(body.date),
      purchase_order_number: purchase_order_number,
      owner_id: req.user.id,
    };
    //create stock
    let purchaseOrderDetails = await purchaseOrderService.create(CreateData);
    //return response
    res.json(Response.OK, {
      message: 'Purchase Order Added',
      purchaseOrderDetails: purchaseOrderDetails,
    });



    // res on finish
    res.on('finish', async () => {
      History.create("Purchase Order Added", req, ObjectName.PURCHASE_ORDER, purchaseOrderDetails.id);
    });
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const get = async (req, res, next) => {
  try {
    const company_id = Request.GetCompanyId(req);

    const purchaseOrderId = req.params.id;
    if (!validator.isInteger(purchaseOrderId)) {
      return next(new errors.BadRequestError('Invalid Purchase Order id'));
    }
    const purchaseOrderDetails = await purchaseOrderService.findOne({ where: { id: purchaseOrderId } });

    const { vendor_id, billing_address_id, delivery_address_id, status } = purchaseOrderDetails;

    const vendorData = await accountService.findOne({
      where: { id: vendor_id, company_id: company_id },
    });

    const { name } = vendorData;
    const statusData = await statusService.findOne({ where: { company_id: company_id, id: status } });

    let BillingAddress = {};
    let DeliveryAddress = {};

    if (billing_address_id) {
      BillingAddress = await addressService.findOne({
        where: { id: billing_address_id, company_id: company_id },
      });
    }
    if (delivery_address_id) {
      DeliveryAddress = await addressService.findOne({
        where: { id: delivery_address_id, company_id: company_id },
      });
    }
    let data = {
      id: purchaseOrderDetails.id,
      purchase_order_number: purchaseOrderDetails.purchase_order_number,
      status: statusData.name,
      date: purchaseOrderDetails.date,
      statusValue: purchaseOrderDetails.status,
      delivery_date: purchaseOrderDetails.delivery_date,
      vendor_id: purchaseOrderDetails.vendor_id,
      vendor_name: name,
      owner_id: purchaseOrderDetails.owner_id,
      billingAddressId: Numbers.Get(BillingAddress?.id),
      deliveryAddressId: Numbers.Get(DeliveryAddress?.id),
      description: purchaseOrderDetails.description,
    };

    if (billing_address_id)
      data.billingAddress =
        BillingAddress?.title +
        ' ' +
        ` (${BillingAddress?.name +
        ', ' +
        BillingAddress?.address1 +
        ', ' +
        BillingAddress?.address2 +
        ' ,' +
        BillingAddress?.city +
        ', ' +
        BillingAddress?.state +
        ', ' +
        BillingAddress?.pin_code
        })`;
    if (delivery_address_id)
      data.deliveryAddress =
        DeliveryAddress?.title +
        ' ' +
        ` (${DeliveryAddress?.name +
        ', ' +
        DeliveryAddress?.address1 +
        ', ' +
        DeliveryAddress?.address2 +
        ' ,' +
        DeliveryAddress?.city +
        ', ' +
        DeliveryAddress?.state +
        ', ' +
        DeliveryAddress?.pin_code
        })`;

    res.json(data);
  } catch (err) {
    next(err);
    console.log(err);
  }
};
const update = async (req, res, next) => {
  let data = req.body;
  let { id } = req.params;

  try {
    let company_id = Request.GetCompanyId(req);

    if (!id) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid Id' });
    }
    let updateData = {};

    if (data.vendor_id) updateData.vendor_id = data.vendor_id;
    if (data.date) updateData.date = DateTime.DateOnly(data.date);
    if (data.delivery_date) updateData.delivery_date = DateTime.DateOnly(data.delivery_date);
    if (data.status) updateData.status = data.status;
    if (data.owner) updateData.owner_id = data.owner;

    if (data.billingAddress) updateData.billing_address_id = data.billingAddress;
    if (data.deliveryAddress) updateData.delivery_address_id = data.deliveryAddress;
    updateData.description = data.description;
    await purchaseOrderService.update(updateData, {
      where: { id, company_id },
    });
    // systemLog
    res.json(Response.OK, { message: 'Purchase Order Updated' });
    res.on('finish', async () => {
      //create system log for sale updation
      History.create("Purchase Order Updated", req, ObjectName.PURCHASE_ORDER, id);
    });
  } catch (err) {
    next(err);
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const updateByStatus = async (req, res, next) => {
  let companyId = Request.GetCompanyId(req);

  let data = req.body;
  let { id } = req.params;
  let company_id = Request.GetCompanyId(req);

  const PurcaseOrderStatus = await purchaseOrderService.findOne({ where: { company_id: companyId, id: id } });

  const { status } = PurcaseOrderStatus;

  const statusValue = await statusService.findOne({ where: { company_id: company_id, id: status } });

  try {
    if (!id) {
      return res.json(Response.BAD_REQUEST, {
        message: 'Invalid Id',
      });
    }

    let updateData = {};
    if (data.status) updateData.status = data.status;

    await purchaseOrderService.update(updateData, {
      where: {
        id,
        company_id,
      },
    });
    const statusData = await statusService.findOne({ where: { company_id: company_id, id: data.status } });

    // systemLog
    res.json(Response.OK, {
      message: 'Purchase Order Status Updated',
    });
    res.on('finish', async () => {
      //create system log for sale updation
      History.create(
        `Purchase Order Status Changed From ${statusValue.name} to ${statusData.name} `,
        req,
        ObjectName.PURCHASE_ORDER,
        id
      );
    });
  } catch (err) {
    next(err);
    console.log(err);
    res.json(Response.BAD_REQUEST, {
      message: err.message,
    });
  }
};

const productList = async (req, res) => {
  const { vendor_id } = req.query;

  try {
    let { page, pageSize, search, sort, sortDir, pagination, category, brand, status, purchaseOrderId, name } =
      req.query;

    if (sort == 'name') {
      sort = 'product_name';
    }
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      return res.json(Response.BAD_REQUEST, { message: 'Product id is required' });
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid page size' });
    }

    if (!vendor_id) {
      return res.json(Response.BAD_REQUEST, { message: 'Vendor Id is Required' });
    }

    let companyId = Request.GetCompanyId(req);

    let purchaseProductIds;

    const productWhere = new Object();

    let filteredProductIds = new Array();

    productWhere.company_id = companyId;

    productWhere.account_id = vendor_id;

    let purchaseProductList = await purchaseOrderProductService.find({
      where: { purchase_order_id: purchaseOrderId, company_id: companyId },
    });

    if (purchaseProductList && purchaseProductList.length > 0) {
      purchaseProductIds = purchaseProductList.map((purchaseProduct) => {
        return purchaseProduct.product_id;
      });

      if (purchaseProductIds && purchaseProductIds.length > 0) {
        productWhere.product_id = { [Op.notIn]: purchaseProductIds };
      }
    }

    const vendorProductList = await AccountProductModel.findAll({
      where: productWhere,
    });

    if (vendorProductList && vendorProductList.length > 0) {
      for (let i = 0; i < vendorProductList.length; i++) {
        filteredProductIds.push(vendorProductList[i].product_id);
      }
    }

    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      product_id: 'product_id',
      product_name: 'product_name',
      brand_name: 'brand_name',
      sale_price: 'sale_price',
      status: 'status',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      category_name: 'category_name',
      brand_name: 'brand_name',
      mrp: 'mrp',
      max_quantity: 'max_quantity',
      min_quantity: 'min_quantity',
      id: 'id',
    };

    const sortParam = sort || 'product_name';
    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json({
        message: `Unable to sort product by ${sortParam}`,
      });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(Response.BAD_REQUEST, { message: 'Invalid sort order' });
    }

    const where = {};
    if (category) {
      where.category_id = { [Op.in]: category.split(',') };
    }
    if (brand) {
      where.brand_id = { [Op.in]: brand.split(',') };
    }
    where.company_id = companyId;
    where.product_id = filteredProductIds;

    if (status) {
      where.status = status;
    }
    // Search by name

    if (name) {
      where.product_name = {
        [Op.like]: `%${name}%`,
      };
    }

    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
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

    const query = {
      distinct: true,
      order: [[sortableFields[sortParam], sortDirParam]],
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
          sale_price,
          brand_name,
          category_name,
          status,
          featured_media_url,
          max_quantity,
          min_quantity,
          quantity,
          mrp,
          product_display_name,
          createdAt,
          updatedAt,
          user,
        } = productDetails;

        const product = {
          id: product_id,
          name: product_name,
          brand: brand_name,
          size: size,
          unit: unit,
          category: category_name,
          brand: brand_name,
          sale_price: sale_price,
          image: featured_media_url,
          mrp: mrp,
          status: status,
          quantity: quantity,
          min_quantity: min_quantity,
          max_quantity: max_quantity,
          product_display_name: product_display_name,
          owner_id: user?.name,
        };
        product.createdAt = DateTime.defaultDateFormat(createdAt);
        product.updatedAt = DateTime.defaultDateFormat(updatedAt);
        data.push(product);
      });
      res.json({
        totalCount: products.count,
        currentPage: page,
        pageSize,
        data: data ? data : [],
        sort,
        sortDir,
        search,
      });
    });
  } catch (err) {
    console.log(err);
    res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const del = async (req, res, next) => {
  const id = req.params.id;
  try {
    const company_id = Request.GetCompanyId(req);

    await purchaseOrderService.delete({ where: { id: id, company_id: company_id } });

    res.json(Response.OK, { message: 'Purchase Order Deleted' });

    res.on('finish', async () => {
      //create system log for sale updation
      History.create("Purchase Order Deleted", req, ObjectName.PURCHASE_ORDER, id);
    });
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const getNextPurchaseOrderNumber = async (company_id) => {
  try {
    let purchase_order_number;
    //get last purchase order
    let lastpurchaseOrder = await purchaseOrderService.findOne({
      order: [['createdAt', 'DESC']],
      where: { company_id },
    });

    //get last purchase order data
    purchase_order_number = lastpurchaseOrder && lastpurchaseOrder.purchase_order_number;
    //validate last purchase order data exist or no
    if (!purchase_order_number) {
      purchase_order_number = 1;
    } else {
      purchase_order_number = purchase_order_number + 1;
    }

    return purchase_order_number;
  } catch (err) {
    console.log(err);
  }
};

const clone = async (req, res, next) => {
  const id = req.params.id;

  try {
    //get purchase order Id
    //get company Id
    const company_id = Request.GetCompanyId(req);

    const ownerId = req.user.id;
    //get purchase order details
    let purchaseOrderDetail = await purchaseOrderService.findOne({ where: { id: id, company_id: company_id } });

    const status = await statusService.findOne({
      where: { company_id: company_id, name: PurchaseOrder.STATUS_DRAFT_TEXT, object_name: ObjectName.PURCHASE_ORDER },
    });

    //validate purchase order detail exist or not
    if (!purchaseOrderDetail) {
      return res.json(Response.BAD_REQUEST, { message: 'Purchase Order Not Found' });
    }

    //create purchase order data
    let createData = {
      company_id,
      status: status?.id,
      vendor_id: purchaseOrderDetail.vendor_id,
      date: DateTime.UTCtoLocalTime(new Date()),
      purchase_order_number: await getNextPurchaseOrderNumber(company_id),
      amount: purchaseOrderDetail.amount ? purchaseOrderDetail.amount : null,
      owner_id: ownerId,
      billing_address_id: purchaseOrderDetail?.billing_address_id,
      delivery_address_id: purchaseOrderDetail?.delivery_address_id,
    };

    //create stock
    let purchaseOrder = await purchaseOrderService.create(createData);

    //get purchase order products
    let purchaseOrderProducts = await purchaseOrderProductService.find({
      where: { company_id: company_id, purchase_order_id: id },
    });

    //validate purchase products exist or not
    if (purchaseOrderProducts && purchaseOrderProducts.length > 0) {
      //loop the purchse order prodcuts
      for (let i = 0; i < purchaseOrderProducts.length; i++) {
        //destructure the purchase order
        const { product_id, status, company_id, unit_price, quantity, amount } = purchaseOrderProducts[i];
        //create purchase order data
        const createData = {
          product_id,
          purchase_order_id: purchaseOrder.id,
          status,
          company_id,
          unit_price,
          quantity,
          amount,
        };
        //create purchase order
        await purchaseOrderProductService.create(createData);
      }
    }

    //send response
    res.json(Response.OK, { message: 'Purchase Order Cloned' });

    res.on('finish', async () => {
      //create system log for sale updation
      History.create("Purchase Order Cloned", req, ObjectName.PURCHASE_ORDER, id);
    });
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

module.exports = {
  search,
  create,
  get,
  update,
  updateByStatus,
  productList,
  del,
  clone,
};
