const Request = require('../lib/request');

// Models
const {
  Transfer: TransferModal,
  status: statusModel,
  Location,
  TransferProduct,
  TransferType,
  User,
  storeProduct,
  Replenishment,
} = require('../db').models;

const Transfer = require('../helpers/Transfer');

const DateTime = require('../lib/dateTime');
const ObjectName = require('../helpers/ObjectName');

//systemLog
const errors = require('restify-errors');
const Boolean = require('../lib/Boolean');
const validator = require('../lib/validator');
const DataBaseService = require('../lib/dataBaseService');
const { shortDateTimeAndMonthMmmFormat } = require('../lib/dateTime');
const { Op } = require('sequelize');
const statusService = new DataBaseService(statusModel);
const transferService = new DataBaseService(TransferModal);
const transferProductModel = new DataBaseService(TransferProduct);
const transferTypeModel = new DataBaseService(TransferType);
const storeService = new DataBaseService(Location);
const transferProductService = require('./TransferProductService');
const StatusService = require('./StatusService');
const Status = require('../helpers/Status');
const { BAD_REQUEST, OK, UPDATE_SUCCESS } = require('../helpers/Response');
const TransferProductStatus = require('../helpers/TransferProduct');
const setting = require('../helpers/Setting');
const { getSettingValue, getValueByObject, getSettingList } = require('./SettingService');
const locationProductService = require('./locationProductService');
const History = require('./HistoryService');
const location = require("../helpers/Location");
const db = require("../db");
const Response = require("../helpers/Response");
const { LOGGED_IN_USER } = require("../helpers/User");
const TransferTypeHelper = require("../helpers/TransferType");
const Permission = require("../helpers/Permission");
const Number = require("../lib/Number");
const Setting = require('../helpers/Setting');
const storeProductService = require('../service/storeProductService');
const ReplenishAllocation = require("../helpers/ReplenishmentAllocation");
const String = require("../lib/string");
const ArrayList = require("../lib/ArrayList");

const create = async (req, res) => {
  try {
    //get company Id from request
    let body = req.body;

    const company_id = Request.GetCompanyId(req);

    //validate store Id exist or not
    if (!body.fromLocationId) {
      return res.json(400, { message: 'Location IsRequired' });
    }
    let query = {
      order: [['createdAt', 'DESC']],
      where: { company_id },
      attributes: ['transfer_number', 'from_store_id', 'to_store_id', 'deletedAt', 'createdAt', 'status', 'id'],
    };

    let lastTransferData = await transferService.findOne(query);

    let transfer_number;
    let transferNumberData = lastTransferData && lastTransferData.transfer_number;
    if (!transferNumberData) {
      transfer_number = 1;
    } else {
      transfer_number = transferNumberData + 1;
    }
    let transferTypeDetail = await transferTypeModel.findOne({
      where: { company_id: company_id, id: body?.type?.value },
    });
    let allowedStatusIds =
      transferTypeDetail && transferTypeDetail?.allowed_statuses && transferTypeDetail?.allowed_statuses?.split(',');
    const status = await StatusService.getFirstStatusDetail(ObjectName.TRANSFER, company_id, allowedStatusIds);
    let ownerId = await StatusService.GetDefaultOwner(status?.default_owner, req.user.id);
    let currentDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(Request.getTimeZone(req)));

    //create stock create object
    let transferCreateData = {
      company_id,
      status: status?.id ? status?.id : null,
      from_store_id: body.fromLocationId,
      to_store_id: body.toLocationId,
      date: body.date ?body.date : currentDate,
      transfer_number: transfer_number,
      type: body.type.value,
      notes: String.Get(body.notes),
      owner_id: ownerId,
      due_date: status?.due_date ? status?.due_date : null,
    };
    //create stock
    let transferDetails = await transferService.create(transferCreateData);
    //return response
    res.json(200, {
      message: 'Transfer Added',
      transferDetails: transferDetails,
      currentStatusId: status,
    });

    // res on finish
    res.on('finish', async () => {
      History.create("Transfer added", req, ObjectName.TRANSFER, transferDetails?.id);
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

const get = async (req, res, next) => {
  try {
    const company_id = Request.GetCompanyId(req);
    let inventoryId = req.params.transferId;
    if (!validator.isInteger(inventoryId)) {
      return next(new errors.BadRequestError('Invalid inventory id'));
    }
    const inventoryTranferDetails = await transferService.findOne({
      where: { id: inventoryId },
      include: [
        {
          required: false,
          model: TransferType,
          as: "Type",
        },
      ],
    });
    let storeIds = [];
    storeIds.push(inventoryTranferDetails.from_store_id);
    storeIds.push(inventoryTranferDetails.to_store_id);
    let locationWhere = {};
    locationWhere.id = storeIds;
    const locationData = await storeService.find({
      where: locationWhere,
    });

    const statusData = await statusService.findOne({
      where: {
        company_id: company_id,
        id: inventoryTranferDetails.status,
      },
    });

    let data = {
      id: inventoryTranferDetails.id,
      transfer_number: inventoryTranferDetails.transfer_number,
      status: statusData?.name ? statusData?.name : "",
      statusId: statusData && statusData?.id,
      date: inventoryTranferDetails?.date,
      from_store_id: inventoryTranferDetails.from_store_id,
      to_store_id: inventoryTranferDetails.to_store_id,
      company_id: inventoryTranferDetails.company_id,
      from_location_name: storeIds[0] == locationData[0].id ? locationData[0].name : locationData[1].name,
      to_location_name: storeIds[1] == locationData[1]?.id ? locationData[1]?.name : locationData[0]?.name,
      type: inventoryTranferDetails.type,
      notes: inventoryTranferDetails.notes,
      owner_id: inventoryTranferDetails.owner_id,
      statusGroup: statusData?.group ? statusData?.group : "",
      due_date: inventoryTranferDetails?.due_date ? inventoryTranferDetails?.due_date : "",
      allowed_statuses:
        inventoryTranferDetails &&
        inventoryTranferDetails?.Type &&
        inventoryTranferDetails?.Type?.allowed_statuses?.split(","),
    };
    res.json(data);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

const search = async (req, res) => {
  try {
    //get params
    const params = req.query;
    //destrcuture the params
    let { page, pageSize, search, sort, sortDir, pagination, status, startDate, endDate, owner, user, selectedDate } = params;

    const manageOthersPermissions = await Permission.GetValueByName(Permission.TRANSFER_MANAGE_OTHERS, req.role_permission);

    //get company Id from request
    const companyId = Request.GetCompanyId(req);
    const timeZone = Request.getTimeZone(req)
    let date = DateTime.getCustomDateTime(selectedDate || req?.query?.date, timeZone)
    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      throw { message: 'Invalid page' };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      throw { message: 'Invalid page size' };
    }

    // Sortable Fields
    const validOrder = ['ASC', 'DESC'];
    const sortableFields = {
      transfer_number: 'id',
      date: 'date',
      from_store_id: 'from_store_id',
      to_store_id: 'to_store_id',
      status: 'status',
      type: 'type',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      owner_id: 'owner_id',
      product_count: "product_count",
      id: "id",
    };

    const sortParam = sort || 'createdAt';

    // Validate sortable fields is present in sort param
    if (!Object.keys(sortableFields).includes(sortParam)) {
      throw { message: `Unable to sort inventory by ${sortParam}` };
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      throw { message: 'Invalid sort order' };
    }

    const data = params;

    // Create where object
    let where = new Object();
    let typeWhere = new Object();

    //create store detail where object
    let fromLocationWhere = new Object();
    let toLocationWhere = new Object();

    //update company Id in where
    where.company_id = companyId;

    // Search by store id
    if (Number.isNotNull(data.fromLocation)) {
      where = { from_store_id: data.fromLocation };
      fromLocationWhere.id = data.fromLocation;
    }
    if (Number.isNotNull(data.toLocation)) {
      where = { to_store_id: data.toLocation };
      toLocationWhere.id = data.toLocation;
    }

    if (manageOthersPermissions) {
      if (Number.Get(owner) || Number.Get(user)) {
        where.owner_id = owner ? owner : user;
      }
    } else {
      where = {
        ...where,
        [Op.or]: [
          { from_store_id: Request.getCurrentLocationId(req) },
          { to_store_id: Request.getCurrentLocationId(req) },

        ]
      };

    }
    if (date && Number.isNotNull(selectedDate || req?.query?.date)) {
      where.date = {
        [Op.and]: {
          [Op.gte]: date?.startDate,
          [Op.lte]: date?.endDate,
        },
      };
    }

    if (startDate && !endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
        },
      };
    }

    if (endDate && !startDate) {
      where.date = {
        [Op.and]: {
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }

    if (startDate && endDate) {
      where.date = {
        [Op.and]: {
          [Op.gte]: startDate,
          [Op.lte]: DateTime.toGetISOStringWithDayEndTime(endDate),
        },
      };
    }

    // Search term
    const searchTerm = search ? search.trim() : null;

    if (searchTerm) {
      where[Op.or] = [
        {
          '$from_location.name$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          '$to_location.name$': {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    let userDetailsWhere = new Object();

    let order = [];
    if (sortParam === 'from_store_id') {
      order.push([{ model: Location, as: 'from_location' }, 'name', sortDirParam]);
    }
    if (sortParam === 'to_store_id') {
      order.push([{ model: Location, as: 'to_location' }, 'name', sortDirParam]);
    }
    if (sortParam === "status") {
      order.push([[{ model: statusModel, as: 'statusDetail' }, 'name', sortDirParam]])
    }
    if (sortParam == "owner_id") {
      order.push([{ model: User, as: "user" }, "name", sortDirParam]);
    }
    if (
      sortParam !== "product_count"
      && sortParam !== "to_store_id"
      && sortParam !== "from_store_id"
      && sortParam === "status"
      && sortParam == "owner_id"
    ) {
      order.push([[sortableFields[sortParam], sortDirParam]]);
    }else{
      order.push([sortParam, sortDirParam]);
    }

    const query = {
      attributes: { exclude: ['deletedAt'] },
      order: order,
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

    const type = data.type;
    if (Number.isNotNull(type)) {
      typeWhere.id = type;
    }

    if (Number.isNotNull(type)) {
      where.type = type;
    }

    let statusIds = Number.isNotNull(status) && status.split(",");
    if (statusIds && statusIds.length > 0) {
      where.status = {
        [Op.in]: statusIds
      };
    }

    //validate search term exist or notto_store_idore

    //append the include
    query.include = [
      {
        required: true,
        model: Location,
        where: fromLocationWhere,
        as: 'from_location',
        attributes: ['id', 'name'],
      },
      {
        required: true,
        model: Location,
        where: toLocationWhere,
        as: 'to_location',
        attributes: ['id', 'name', 'print_name'],
      },
      {
        required: true,
        model: TransferType,
        where: typeWhere,
        as: 'Type',
      },
      {
        model: User,
        where: userDetailsWhere,
        as: 'user',
        attributes: ['id', 'name', 'media_url', 'last_name'],
      },
      {
        required: false,
        model: statusModel,
        as: 'statusDetail',
      },
    ];

    // Get Transfer list and count
    const transferList = await transferService.findAndCount(query);

    const transferData = [];

    let transferListData = transferList && transferList.rows;
    if (transferListData && transferListData.length > 0) {
      //loop the stock entry list
      for (let i = 0; i < transferListData.length; i++) {
        const {
          id,
          to_location,
          createdAt,
          date,
          from_location,
          transfer_number,
          status,
          type,
          from_store_id,
          to_store_id,
          updatedAt,
          user,
          Type,
          statusDetail,
          notes,
          due_date,
        } = transferListData[i];

        let getDetail = await transferProductModel.findAndCount({
          where: { transfer_id: id, company_id: companyId },
        });
        let detail = getDetail.rows;
        let totalAmount = 0;

        for (let i = 0; i < detail.length; i++) {
          totalAmount += Number.Get(detail[i].amount);
        }

        const data = {
          fromLocationName: from_location.name,
          transfer_number: transfer_number,
          toLocationName: to_location.name,
          status: statusDetail?.name,
          statusColor: statusDetail?.color_code,
          currentStatusId: statusDetail && statusDetail.id,
          id: id,
          from_store_id: from_store_id,
          to_store_id: to_store_id,
          amount: totalAmount,
          product_count: getDetail.count,
          type: Type.name,
          type_id: Type.id,
          owner: user.name,
          lastName: user.last_name,
          offlineMode: Type.offline_mode,
          companyId: companyId,
          date: date,
          createdAt: shortDateTimeAndMonthMmmFormat(createdAt),
          updatedAt: shortDateTimeAndMonthMmmFormat(updatedAt),
          notes: notes,
          owner_id: user.id,
          image: user.media_url,
          printName: to_location.print_name,
          due_date: due_date,
          allowed_statuses: Type && Type?.allowed_statuses?.split(",")
        };
        transferData.push(data);
      }

      // Sorting by product_count after data retrieval
      if (sortParam === "product_count") {
        transferData.sort((a, b) => {
          if (sortDirParam === "ASC") {
            return a.product_count - b.product_count;
          } else {
            return b.product_count - a.product_count;
          }
        });
      }
    }

    // return response
    return res.json(200, {
      totalCount: transferList.count,
      currentPage: page,
      pageSize,
      data: transferData,
      sort,
      sortDir,
      type: type ? type : '',
      pagination,
      status: status ? status : '',
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

const update = async (req, res) => {
  const Id = req.params.id;

  try {
    //get company Id from request
    let body = req.body;

    const company_id = Request.GetCompanyId(req);

    let inventoryExist = await transferService.findOne({
      where: { id: Id, company_id: company_id },
      include: [
        {
          required: false,
          model: TransferType,
          as: "Type",
        },
      ],
    });

    if (!inventoryExist) {
      return res.json(400, { message: 'Inventory Not Found' });
    }

    //create stock create object
    let transferUpdateData = new Object();


    if (body.fromLocationId) {
      transferUpdateData.from_store_id = body.fromLocationId;
    }

    if (body.toLocationId) {
      transferUpdateData.to_store_id = body.toLocationId;
    }

    if (body.date) {
      transferUpdateData.date = body.date;
    }
    if (body.type) {
      transferUpdateData.type = body.type;
    }
    transferUpdateData.notes = String.Get(body.notes);
    if (body.owner) {
      transferUpdateData.owner_id = body.owner;
    }
    if (body.due_date) {
      transferUpdateData.due_date = body.due_date;
    }

    //create stock
    await transferService.update(transferUpdateData, {
      where: { id: Id, company_id: company_id },
    });
    await transferProductService.update(req, res);


    //return response
    res.json(200, {
      message: 'Inventory Updated',
    });

    // res on finish
    res.on('finish', async () => {
      History.create("Transfer Updated", req, ObjectName.TRANSFER, Id);
    });
  } catch (err) {
    console.log(err);
    return res.json(400, { message: err.message });
  }
};

const updateStatus = async (data, id) => {
  try {
    const save = await transferService.update(data, { where: { id } });
    return save

  } catch (err) {
    console.log(err);
    throw err
  }
};

const del = async (req, res, next) => {
  const transferId = req.params.transferId;
  const companyId = Request.GetCompanyId(req);

  transferService
    .findOne({ where: { id: transferId, company_id: companyId } })
    .then((inventory) => {
      if (!inventory) {
        return next(new errors.NotFoundError('Transfer not found'));
      }
      transferService
        .delete({
          where: { id: transferId, company_id: companyId },
        })
        .then(() => {
          res.json({ message: ' Transfer Deleted' });
          res.on('finish', async () => {
            History.create("Transfer Deleted", req, ObjectName.TRANSFER, transferId);
          });
        });
    })
    .catch((err) => {
      req.log.error(err);
      next(err);
    });
};

const replenishment = async (body, userId, transferTypeDetail, transferFirstStatus, replenishSetting, companyId, transferDataList) => {
  try {
    let transferDetail = transferDataList !== null ? transferDataList[body?.toLocationId] : null

    if (transferDetail) {
      let transferProductDetail = await transferProductModel.findOne({
        where: {
          transfer_id: transferDetail.id,
          company_id: companyId,
          product_id: body?.productId,
          type: transferDetail.type,
        },
      });

      if (!transferProductDetail) {
        let transferProduct = await transferProductModel.create({
          transfer_id: transferDetail.id,
          quantity: body?.quantity,
          from_store_id: transferTypeDetail.default_from_store,
          to_store_id: body?.toLocationId,
          status: TransferProductStatus.DRAFT,
          company_id: companyId,
          product_id: body?.productId,
          type: transferDetail.type,
          created_by: userId,
        });
        if (transferProduct) {
          await locationProductService.updateByProductId(body?.toLocationId, body?.productId, companyId, {
            replenish_quantity: body?.quantity,
          });
        }
      } else {
        await transferProductModel.update(
          { quantity: body?.quantity },
          { where: { id: transferProductDetail.id, company_id: companyId } }
        );

        await locationProductService.updateByProductId(body?.toLocationId, body?.productId, companyId, {
          replenish_quantity: body?.quantity,
        });
      }
    } else {
      let lastTransferNumber = await transferProductService.getNextTransferOrderNumber(companyId);

      let transferDetail = await transferService.create({
        from_store_id: transferTypeDetail.default_from_store,
        to_store_id: body?.toLocationId,
        company_id: companyId,
        status: transferFirstStatus ? transferFirstStatus : null,
        date: new Date(),
        type: replenishSetting,
        owner_id: userId,
        transfer_number: lastTransferNumber,
      });

      if (transferDetail) {
        let transferProduct = await transferProductModel.create({
          transfer_id: transferDetail.id,
          quantity: body?.quantity,
          from_store_id: transferTypeDetail.default_from_store,
          to_store_id: body?.toLocationId,
          status: TransferProductStatus.DRAFT,
          company_id: companyId,
          product_id: body?.productId,
          type: transferDetail.type,
          created_by: userId,
        });
        if (transferProduct) {
          await locationProductService.updateByProductId(body?.toLocationId, body?.productId, companyId, {
            replenish_quantity: body?.quantity,
          });
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const replenish = async (req, res, next) => {
  try {
    const companyId = Request.GetCompanyId(req);

    const userId = Request.getUserId(req);

    const body = req.body;

    if (!body.toLocationId) {
      return res.json(BAD_REQUEST, { message: 'To Location Id is Required' });
    }

    if (validator.isEmpty(body.quantity)) {
      return res.json(BAD_REQUEST, { message: 'Quantity is Required' });
    }

    if (!body.productId) {
      return res.json(BAD_REQUEST, { message: 'product Id is Required' });
    }

    let transferReplenishmentStatus = await statusModel.findOne({
      where: { object_name: ObjectName.TRANSFER, company_id: companyId, allow_replenishment: Status.ALLOW_REPLENISHMENT }
    });

    let replenishSetting = await getSettingValue(setting.SETTING_REPLENISH_TRANSFER_TYPE, companyId);

    if (replenishSetting) {
      let transferTypeDetail = await TransferType.findOne({ where: { id: replenishSetting, company_id: companyId } });

      if (transferTypeDetail) {
        if (!transferTypeDetail.default_from_store) {
          return res.json(BAD_REQUEST, { message: 'Default From Location Required For Transfer Type' });
        }

        if (transferReplenishmentStatus) {
          let transferDetail = await transferService.find({
            where: {
              from_store_id: transferTypeDetail.default_from_store,
              company_id: companyId,
              type: replenishSetting,
              status: transferReplenishmentStatus.id,
            },
            order: [["createdAt", "DESC"]],
            attributes: ["id", "type", "from_store_id", "to_store_id"]
          });


          const transferDataList = ArrayList.mapByKey(transferDetail, "to_store_id");

          await replenishment(body, userId, transferTypeDetail, transferReplenishmentStatus.id, replenishSetting, companyId, transferDataList)

          res.json(OK, { message: 'Transfer Product Added' });

          res.on('finish', async () => {
            await Replenishment.update(
              { status: ReplenishAllocation.STATUS_COMPLETED },
              { where: { product_id: body.productId, owner_id: userId } }
            );
          });
        } else {
          return res.json(BAD_REQUEST, { message: 'Add Replenishment Initial Status Config' });
        }
      }
    } else {
      return res.json(BAD_REQUEST, { message: 'Add Replenish Transfer Type' });
    }
  } catch (err) {
    console.log(err);
  }
};

const bulkReplenish = async (req, res, next) => {
  try {
    const companyId = Request.GetCompanyId(req);

    const userId = Request.getUserId(req);

    const body = req.body;

    let replenishList = body && body.replenishList;

    let transferReplenishmentStatus = await statusModel.findOne({
      where: { object_name: ObjectName.TRANSFER, company_id: companyId, allow_replenishment: Status.ALLOW_REPLENISHMENT }
    });

    let replenishSetting = await getSettingValue(setting.SETTING_REPLENISH_TRANSFER_TYPE, companyId);

    if (replenishSetting) {
      let transferTypeDetail = await TransferType.findOne({ where: { id: replenishSetting, company_id: companyId } });

      if (transferTypeDetail) {
        if (!transferTypeDetail.default_from_store) {
          return res.json(BAD_REQUEST, { message: 'Default From Location Required For Transfer Type' });
        }

        if (transferReplenishmentStatus) {

          let transferDetail = await transferService.find({
            where: {
              from_store_id: transferTypeDetail.default_from_store,
              company_id: companyId,
              type: replenishSetting,
              status: transferReplenishmentStatus.id,
            },
            order: [["createdAt", "DESC"]],
            attributes: ["id", "type", "from_store_id", "to_store_id"]
          });


          const transferDataList = ArrayList.mapByKey(transferDetail, "to_store_id");


          if (replenishList && replenishList.length > 0) {

            for (let i = 0; i < replenishList.length; i++) {

              await replenishment(replenishList[i], userId, transferTypeDetail, transferReplenishmentStatus.id, replenishSetting, companyId, transferDataList)

            }

          }
        } else {
          return res.json(BAD_REQUEST, { message: 'Add Replenishment Initial Status Config' });
        }
      }
      res.json(OK, { message: 'Transfer Created' });

      res.on('finish', async () => {
        await Replenishment.update(
          { status: ReplenishAllocation.STATUS_COMPLETED },
          { where: { product_id: replenishList[0].productId, owner_id: userId } }
        );
      });
    } else {
      return res.json(BAD_REQUEST, { message: 'Add Replenish Transfer Type' });
    }
  } catch (err) {
    console.log(err);
  }
};

const bulkUpdate = async (req, res) => {
  try {
    let { id, date, from_location, owner, to_location } = req.params;

    let companyId = Request.GetCompanyId(req);
    if (!companyId) {
      return res.json(400, { message: 'Company Id Not Found' });
    }

    let transferIds = [];
    let Ids = id.split(',');

    for (let i in Ids) {
      let ids = Ids[i];
      transferIds.push(ids);
    }

    for (let i in transferIds) {
      let transferUpdateData = {};
      if (from_location) {
        transferUpdateData.from_store_id = from_location;
      }
      if (to_location) {
        transferUpdateData.to_store_id = to_location;
      }
      if (owner) {
        transferUpdateData.owner_id = owner;
      }
      if (date) {
        transferUpdateData.date = date;
      }

      await transferService.update(transferUpdateData, {
        where: { id: transferIds[i], company_id: companyId },
      });
    }

    res.json(200, {
      message: 'Transfer Updated',
    });
  } catch (err) {
    console.log(err);
  }
};

const replenishProduct = async (req, res) => {
  try {

    const params = req.query;
    let companyId = Request.GetCompanyId(req);

    //destrcuture the params
    let { page, pageSize, sort, sortDir, search, pagination, toLocationId, transferId } = params;

    // Validate if page is not a number
    page = page ? parseInt(page, 10) : 1;
    if (isNaN(page)) {
      throw { message: 'Invalid page' };
    }

    // Validate if page size is not a number
    pageSize = pageSize ? parseInt(pageSize, 10) : 25;
    if (isNaN(pageSize)) {
      throw { message: 'Invalid page size' };
    }
    let distributionCenterStoreId = await getSettingValue(location.DISTRIBUTION_CENTER, companyId);

    const searchTerm = search ? search.trim() : "";

    const sortParam = sort || 'product_name';

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'ASC';
    const query = `SELECT *
      FROM product_index
      WHERE product_id IN (
        SELECT store_product.product_id
        FROM store_product
        WHERE store_product.quantity > 0
        AND store_product.store_id = ${distributionCenterStoreId} 
      )
      AND product_id IN (
        SELECT store_product.product_id
        FROM store_product
        WHERE (store_product.quantity < 1 OR store_product.quantity IS NULL)
        AND store_product.store_id = ${toLocationId}
      )
      AND product_id NOT IN (
        SELECT transfer_product.id
        FROM transfer_product
        WHERE transfer_id = ${transferId}
      )
      AND (product_name ILIKE '%${searchTerm}%' OR product_display_name ILIKE '%${searchTerm}%' OR brand_name ILIKE '%${searchTerm}%')
      ORDER BY ${sortParam} ${sortDirParam}
     `;

    let queryData = await db.connection.query(query);

    let productList = queryData[1];

    let productArray = []

    for (let i = 0; i < productList.rows.length; i++) {
      let data = {
        product_id: productList.rows[i].product_id,
        product_name: productList.rows[i].product_name,
        size: productList.rows[i].size,
        unit: productList.rows[i].unit,
        mrp: productList.rows[i].mrp,
        sale_price: productList.rows[i].sale_price,
        cost: productList.rows[i].cost,
        brand_name: productList.rows[i].brand_name,
        brand_id: productList.rows[i].brand_id,
        category_name: productList.rows[i].category_name,
        image: productList.rows[i].featured_media_url,
      }
      productArray.push(data)
    }

    const offset = (page - 1) * pageSize;
    const paginatedResults = productArray.slice(offset, offset + pageSize);
    //return response
    return res.json(Response.OK, {
      totalCount: productList.rowCount,
      currentPage: page,
      pageSize,
      data: paginatedResults,
      sort,
      sortDir,
      pagination,
    });
  } catch (err) {
    console.log(err);
    return res.json(Response.BAD_REQUEST, { message: err.message });
  }
};

const bulkCreate = async (req, res) => {
  try {
    const companyId = Request.GetCompanyId(req);

    if (!companyId) {
      return res.json(400, { message: 'Company Id Not Found' });
    }

    const body = req.body;

    let selectedIds = body && body.storeProductIds;

    let ids = selectedIds !== '' ? selectedIds.split(',') : [];

    if (ids && ids.length == 0) {
      return res.json(Response.BAD_REQUEST, { message: 'Please Select Atleast One Product' });
    }

    let where = {};

    if (ids && ids.length > 0) {
      where.id = { [Op.in]: ids };
    }

    let settingArray = [];
    let settingList = await getSettingList(Request.GetCompanyId(req));

    for (let i = 0; i < settingList.length; i++) {
      settingArray.push(settingList[i]);
    }
    where.company_id = companyId;

    let storeProductData = await storeProduct.findAll({
      where: where,
      attributes: [
        'quantity',
        'id',
        'product_id',
        'discrepancy_quantity',
        'store_id',
        'return_quantity',
        'transfer_quantity',
        'order_quantity',
      ],
    });

    let storeIds = storeProductData.map((value) => value.store_id);

    let uniqueStoreIds = Array.from(new Set(storeIds));

    let missingType = await getValueByObject(Setting.MISSING_TRANSFER_TYPE, settingArray);

    let transferTypeDetail = await TransferType.findOne({ where: { id: missingType, company_id: companyId } });

    let transferTypeStatusData = await StatusService.getData(transferTypeDetail?.allowed_statuses, companyId);

    const transferProductStatus = await StatusService.getFirstStatus(ObjectName.TRANSFER_PRODUCT, companyId);

    let excessType = await getValueByObject(Setting.EXCESS_TRANSFER_TYPE, settingArray);

    let excessTypeDetail = await TransferType.findOne({ where: { id: excessType, company_id: companyId } });

    let excessTypeStatusData = await StatusService.getData(excessTypeDetail?.allowed_statuses, companyId);

    const getNextTransferNumber = async (company_id) => {
      let transfer_number;
      //get lastTransfer
      let lastTransfer = await transferService.findOne({
        order: [['createdAt', 'DESC']],
        where: { company_id },
      });

      //get lastTransfer
      transfer_number = lastTransfer && lastTransfer.transfer_number;
      //validate lastTransfer exist or no
      if (!transfer_number) {
        transfer_number = 1;
      } else {
        transfer_number = transfer_number + 1;
      }

      return transfer_number;
    };
    let createData = {};
    if (uniqueStoreIds && uniqueStoreIds.length > 0) {
      for (let i = 0; i < uniqueStoreIds.length; i++) {
        let storeProductList = storeProductData.filter((value) => value.store_id == uniqueStoreIds[i]);

        if (storeProductList && storeProductList.length > 0) {
          for (let j = 0; j < storeProductList.length; j++) {
            let discrepancyQty =
              Number.Get(storeProductList[j].transfer_quantity) -
              (Number.Get(storeProductList[j].order_quantity) + Number.Get(storeProductList[j].return_quantity)) -
              Number.Get(storeProductList[j].quantity);

            if (discrepancyQty > 0) {

              createData = {
                status: transferTypeStatusData?.id,
                date: new Date(),
                transfer_number: await getNextTransferNumber(companyId),
                from_store_id: uniqueStoreIds[i],
                to_store_id: transferTypeDetail?.default_to_store,
                type: transferTypeDetail?.id,
                owner_id: req.user.id,
                company_id: companyId,
              };

              let transferData = await transferService.create(createData);
              const createDatas = {
                company_id: companyId,
                status: transferProductStatus,
                transfer_id: transferData?.id,
                product_id: storeProductList[j].product_id,
                quantity: discrepancyQty,
                type: transferData.type,
                from_store_id: transferData.from_store_id,
                to_store_id: transferData.to_store_id,
                created_by: req.user.id,
              };

              let transferProductDetail = await TransferProduct.create(createDatas);

              await locationProductService.Reindex(companyId, storeProductList[j].product_id);

              if (transferProductDetail && transferTypeStatusData.update_quantity == Status.UPDATE_QUANTITY_ENABLED) {
                await storeProductService.decreaseQuantity(
                  discrepancyQty,
                  storeProductList[j].product_id,
                  companyId,
                  uniqueStoreIds[i]
                );

                await storeProductService.increaseQuantity(
                  discrepancyQty,
                  storeProductList[j].product_id,
                  companyId,
                  transferTypeDetail?.default_to_store
                );
              }
            }
            if (discrepancyQty < 0) {

              createData = {
                status: transferTypeStatusData?.id,
                date: new Date(),
                transfer_number: await getNextTransferNumber(companyId),
                from_store_id: excessTypeDetail?.default_from_store,
                to_store_id: uniqueStoreIds[i],
                type: transferTypeDetail?.id,
                owner_id: req.user.id,
                company_id: companyId,
              };

              let transferData = await transferService.create(createData);

              const createDatas = {
                company_id: companyId,
                status: transferProductStatus,
                transfer_id: transferData?.id,
                product_id: storeProductList[j].product_id,
                quantity: Math.abs(discrepancyQty),
                type: transferData.type,
                from_store_id: transferData.from_store_id,
                to_store_id: transferData.to_store_id,
                created_by: req.user.id,
              };

              let transferProductDetail = await TransferProduct.create(createDatas);

              await locationProductService.Reindex(companyId, storeProductList[j].product_id);

              if (transferProductDetail && excessTypeStatusData.update_quantity == Status.UPDATE_QUANTITY_ENABLED) {
                await storeProductService.decreaseQuantity(
                  Math.abs(discrepancyQty),
                  storeProductList[j].product_id,
                  companyId,
                  excessTypeDetail?.default_from_store
                );

                await storeProductService.increaseQuantity(
                  Math.abs(discrepancyQty),
                  storeProductList[j].product_id,
                  companyId,
                  uniqueStoreIds[i]
                );
              }
            }
          }
        }
      }
    }
    return res.json(Response.OK, { message: 'Transfer Added' });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  search,
  create,
  get,
  update,
  updateStatus,
  del,
  replenish,
  bulkUpdate,
  bulkReplenish,
  replenishProduct,
  bulkCreate,
};
