const DateTime = require("../lib/dateTime");
const ReplenishmentService = require("./ReplenishmentService");
const { Op, Sequelize } = require("sequelize");
const {
  Attendance,
  ReplenishmentAllocation,
  productIndex,
  ProductPrice: ProductPriceModel,
  productTag,
  Replenishment,
  User,
  UserIndex
} = require("../db").models;
const validator = require("../lib/validator");
const Boolean = require("../lib/Boolean");
const ReplenishAllocation = require("../helpers/ReplenishmentAllocation");
const { IS_DEFAULT } = require("../helpers/ProductPrice");
const locationProductService = require("../services/locationProductService");
const UserService = require("./UserService");
const Setting = require("../helpers/Setting");
const { getSettingList } = require("./SettingService");
const { getValueByObject } = require("./ValidationService");
const ObjectName = require("../helpers/ObjectName");
const ArrayList = require("../lib/ArrayList");
const String = require("../lib/string");
const Permission = require("../helpers/Permission");
const Request = require("../lib/request");
const Response = require("../helpers/Response");
const Status = require("../helpers/Status");
const Number = require("../lib/Number");

class ReplenishmentAllocationService {
  static async create(companyId) {
    try {
      let param = {
        replenishmentAllowed: true,
      };

      let response = await ReplenishmentService.pendingList(param, companyId);

      let userIds = await UserService.getUsersBySetting(
        Setting.ALLOW_REPLENISHMENT,
        companyId
      );

      if (userIds && userIds.length > 0) {
        let attendanceData = await Attendance.findAll({
          where: {
            company_id: companyId,
            date: DateTime.DateOnly(new Date()),
            user_id: userIds,
            login: { [Op.ne]: null },
          },
        });
        let settingArray = [];
        let settingList = await getSettingList(companyId);

        if (settingList && settingList.length > 0) {
          for (let i = 0; i < settingList.length; i++) {
            settingArray.push(settingList[i]);
          }
        }

        // Calculate the number of items per user
        const itemsPerUser = Math.ceil(response.length / attendanceData.length);

        // Loop through each attendance entry
        if (response && response.length > 0) {
          if (attendanceData && attendanceData.length > 0) {
            for (let i = 0; i < attendanceData.length; i++) {
              // Get the slice of response data for the current user
              const startIndex = i * itemsPerUser;
              const endIndex = Math.min(
                startIndex + itemsPerUser,
                response.length
              );
              const userResponseData = response.slice(startIndex, endIndex);

              // Create ReplenishmentAllocation records for the user
              for (let j = 0; j < userResponseData.length; j++) {
                const productExists = await ReplenishmentAllocation.findOne({
                  where: {
                    product_id: userResponseData[j].product_id,
                    date: DateTime.DateOnly(new Date()),
                  },
                });

                const replenishData =
                  await locationProductService.searchReplenishStoreProduct(
                    userResponseData[j].product_id,
                    companyId
                  );

                const userTags = await getValueByObject(
                  Setting.PRODUCT_TAG,
                  settingArray,
                  attendanceData[i].user_id,
                  ObjectName.USER
                );
                let allowedTags = [];

                if (userTags) {
                  allowedTags = ArrayList.StringIntoArray(userTags);
                }

                let productTags = await productTag.findAll({
                  where: {
                    company_id: companyId,
                    tag_id: allowedTags,
                  },
                });

                let productIds =
                  productTags && productTags.length > 0
                    ? productTags.map((value) => value.product_id)
                    : [];
                // Create ReplenishmentAllocation if it doesn't exist
                if (!productExists) {
                  let isTagExists =
                    productIds &&
                    productIds.length > 0 &&
                    productIds.includes(userResponseData[j].product_id);

                  if (isTagExists) {
                    await ReplenishmentAllocation.create({
                      product_id: userResponseData[j].product_id,
                      user_id: attendanceData[i].user_id,
                      company_id: companyId,
                      date: attendanceData[i].date,
                      status: ReplenishAllocation.STATUS_PENDING,
                      required_location_count:
                        replenishData &&
                        replenishData.replenishStoreList.length,
                    });
                  } else {
                    await ReplenishmentAllocation.create({
                      product_id: userResponseData[j].product_id,
                      user_id: attendanceData[i].user_id,
                      company_id: companyId,
                      date: attendanceData[i].date,
                      status: ReplenishAllocation.STATUS_PENDING,
                      required_location_count:
                        replenishData &&
                        replenishData.replenishStoreList.length,
                    });
                  }
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async search(params, companyId,) {
    try {
      //destrcuture the params
      let { page, pageSize, sort, sortDir, pagination, user } = params;

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

      let where = {};

      if(user)
        {where.user_id = user;
  
        }  
      where.company_id = companyId;
      where.status = ReplenishAllocation.STATUS_PENDING;

      where.required_location_count = { [Op.gt]: 0 };

      where.date = DateTime.DateOnly(new Date());

      let query = {
        where,
        include: [
          {
            required: false,
            model: productIndex,
            as: "productIndexList",
          },
          {
            required: false,
            model: UserIndex,
            as: "userDetails",
          },
        ],
        order:[["required_location_count","DESC"]]
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

      let productList = await ReplenishmentAllocation.findAndCountAll(query);

      let productArray = [];

      for (let i = 0; i < productList.rows.length; i++) {
        let { productIndexList,userDetails } = productList.rows[i];

        let priceData = await ProductPriceModel.findOne({
          where: {
            product_id: productIndexList.product_id,
            is_default: IS_DEFAULT,
          },
        });

        let data = {
          product_id: productIndexList.product_id,
          product_name: productIndexList.product_name,
          size: productIndexList.size,
          unit: productIndexList.unit,
          mrp: productIndexList.mrp,
          sale_price: productIndexList.sale_price,
          cost: productIndexList.cost,
          brand_name: productIndexList.brand_name,
          brand_id: productIndexList.brand_id,
          category_name: productIndexList.category_name,
          image: productIndexList.featured_media_url,
          barcode: priceData && priceData.barcode,
          allocationId: productList.rows[i].id,
          required_location_count: productList.rows[i].required_location_count,
           status : productList.rows[i].status == ReplenishAllocation.STATUS_PENDING?  ReplenishAllocation.STATUS_PENDING_TEXT:ReplenishAllocation.STATUS_COMPLETED,
          userName:String.concatName(userDetails?.first_name, userDetails?.last_name)
        };
        productArray.push(data);
      }

      return {
        totalCount: productList.count,
        currentPage: page,
        pageSize,
        data: productArray,
        sort,
        sortDir,
        pagination,
      };
    } catch (err) {
      console.log(err);
    }
  }

  static async report(req, res) {
    try {
      let { page, pageSize, search, sort, sortDir, brand, category, user, pagination } =
        req.query;
      page = page ? parseInt(page, 10) : 1;

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid page size" });
      }

      const validOrder = ["ASC", "DESC"];
      const sortableFields = {
        distribution_center_quantity: "distribution_center_quantity",
        quantity: "quantity",
        store_count: "store_count",
        product_name: "product_name",
        status: "status",
        user:"first_name"
      };
      const sortParam = sort || "store_count";
      if (!Object.keys(sortableFields).includes(sortParam)) {
        return res.json(Response.BAD_REQUEST, {
          message: `Unable to sort payments by ${sortParam}`,
        });
      }

      const sortDirParam = sortDir ? sortDir.toUpperCase() : "DESC";
      // Validate order is present in sortDir param
      if (!validOrder.includes(sortDirParam)) {
        return res.json(Response.BAD_REQUEST, { message: "Invalid sort order" });
      }
      let companyId = Request.GetCompanyId(req);

      let userId = Request.getUserId(req);

      const hasPermission = await Permission.Has(
        Permission.REPLENISHMENT_MANAGE_OTHERS,
        req
      );

      const where = {};

      const productIndexWhere = {};

      where.company_id = companyId;

      if (brand) {
        productIndexWhere.brand_id = brand;
      }

      if (user) {
        where.owner_id = user;
      }
      if (category) {
        productIndexWhere.category_id = category;
      }

      if (!hasPermission && userId) {
        where.owner_id = userId;
      }
      
      // Search term
      const searchTerm = search ? search.trim() : null;

  
      
      if (searchTerm ) {
        where[Op.or] = [
          {
            '$userDetails.first_name$': {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            '$userDetails.last_name$': {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          
        ]
      }

      const data = [];
      let order=[]
      if(sortParam === "user"){
        order.push([{ model: UserIndex, as: "userDetails" }, 'first_name', sortDirParam])
      }

      const query = {
        attributes: [
          "owner_id",
          [Sequelize.fn('COUNT', Sequelize.col('owner_id')), 'total_count'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN "Replenishment"."status" = 1 THEN 1 END`)), 'pendingStatus'],
          [Sequelize.fn('COUNT', Sequelize.literal(`CASE WHEN "Replenishment"."status" = 2 THEN 2 END`)), 'completedStatus']
        ],
        group: ["owner_id", "userDetails.id"],
        include: [
          {
            required:false,
            model: UserIndex,
            as: "userDetails",
            attributes:["first_name","last_name","user_id","media_url","id"]
          },
        ],
        where, 
        order:order 
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
      
      let replenishProductsData = await Replenishment.findAndCountAll(query);

      // Return products is null
      if (replenishProductsData.count === 0) {
        return res.json(data);
      }

      for (let i = 0; i < replenishProductsData.rows.length; i++) {

      let replenishData = replenishProductsData && replenishProductsData.count.find(value=>value.owner_id == null)
      
        data.push({ownerName:
          String.concatName(replenishProductsData.rows[i].userDetails?.first_name,replenishProductsData.rows[i].userDetails?.last_name),
          media_url:replenishProductsData.rows[i].userDetails?.media_url,
          ownerId:
            replenishProductsData.rows[i] &&
            replenishProductsData.rows[i].userDetails &&
            replenishProductsData.rows[i].userDetails?.user_id,
            replenishCount:replenishProductsData.rows[i] &&
            Number.Get(replenishProductsData.rows[i].dataValues.total_count) || replenishData.count,
            pendingStatus:replenishProductsData.rows[i] && Number.Get(replenishProductsData.rows[i].dataValues.pendingStatus),
            completedStatus:replenishProductsData.rows[i] && Number.Get(replenishProductsData.rows[i].dataValues.completedStatus),
            completedStatusId :ReplenishAllocation.STATUS_COMPLETED,
            pendingStatusId :ReplenishAllocation.STATUS_PENDING,

        });
      }
      res.json({
        totalCount: replenishProductsData?.count?.length,
        currentPage: page,
        pageSize,
        data: data,
        sort,
        sortDir,
        search,
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async list(params, companyId) {
    try {
      let { user } = params;

      let where = {};

      if (user) {
        where.user_id = user;
      }
      where.company_id = companyId;


      let query = {
        where,
        include: [
          {
            required: false,
            model: productIndex,
            as: "productIndexList",
          },
          {
            required: false,
            model: UserIndex,
            as: "userDetails",
          },
        ],
        order: [["required_location_count", "DESC"]],
      };
      

      let productList = await ReplenishmentAllocation.findAndCountAll(query);

      let productArray = [];

      for (let i = 0; i < productList.rows.length; i++) {
        let { productIndexList, userDetails } = productList.rows[i];

        let priceData = await ProductPriceModel.findOne({
          where: {
            product_id: productIndexList.product_id,
            is_default: IS_DEFAULT,
          },
        });

        let data = {
          product_id: productIndexList.product_id,
          product_name: productIndexList.product_name,
          size: productIndexList.size,
          unit: productIndexList.unit,
          mrp: productIndexList.mrp,
          sale_price: productIndexList.sale_price,
          cost: productIndexList.cost,
          brand_name: productIndexList.brand_name,
          brand_id: productIndexList.brand_id,
          category_name: productIndexList.category_name,
          image: productIndexList.featured_media_url,
          barcode: priceData && priceData.barcode,
          allocationId: productList.rows[i].id,
          required_location_count: productList.rows[i].required_location_count,
          status:
            productList.rows[i].status == ReplenishAllocation.STATUS_PENDING
              ? ReplenishAllocation.STATUS_PENDING_TEXT
              : ReplenishAllocation.STATUS_COMPLETED,
          userName: String.concatName(userDetails?.first_name, userDetails?.last_name),
        };
        productArray.push(data);
      }

      return {
        totalCount: productList.count,
        data: productArray,
      };
    } catch (err) {
      console.log(err);
    }
  }
}


module.exports = ReplenishmentAllocationService;
