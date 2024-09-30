// Utils
const { Op } = require("sequelize");

// Status
const { BAD_REQUEST } = require("../helpers/Response");
const DateTime = require("../lib/dateTime");

// Lib
const Request = require("../lib/request");

// Constants

const {
  productIndex,
  storeProduct,
  Location,
  Replenishment,
  UserIndex,
  productTag,
  Attendance,
} = require("../db").models;

const Product = require("../helpers/Product");

const Boolean = require("../lib/Boolean");

const Number = require("../lib/Number");

const validator = require("../lib/validator");

const ArrayList = require("../lib/ArrayList");

const location = require("../helpers/Location");

const {
  getSettingValue,
  getSettingList,
} = require("../services/SettingService");

const Permission = require("../helpers/Permission");
const db = require("../db");
const Response = require("../helpers/Response");
const { getValueByObject } = require("./ValidationService");
const Setting = require("../helpers/Setting");
const ObjectName = require("../helpers/ObjectName");
const ProductPriceService = require("../services/ProductPriceService");
const Status = require("../helpers/Status");
const UserService = require("./UserService");

class ReplenishService {
  static async search(req, res) {
    try {
      let {
        page,
        pageSize,
        search,
        sort,
        sortDir,
        pagination,
        brand,
        category,
        user,
      } = req.query;
      page = page ? parseInt(page, 10) : 1;

      // Validate if page size is not a number
      pageSize = pageSize ? parseInt(pageSize, 10) : 25;
      if (isNaN(pageSize)) {
        return res.json(BAD_REQUEST, { message: "Invalid page size" });
      }

      const validOrder = ['ASC', 'DESC'];
      const sortableFields = {
        distribution_center_quantity: 'distribution_center_quantity',
        quantity: 'quantity',
        store_count: 'store_count',
        product_name: "product_name",

      };
    const sortParam = sort || 'store_count';
    if (!Object.keys(sortableFields).includes(sortParam)) {
      return res.json(BAD_REQUEST, { message: `Unable to sort payments by ${sortParam}` });
    }

    const sortDirParam = sortDir ? sortDir.toUpperCase() : 'DESC';
    // Validate order is present in sortDir param
    if (!validOrder.includes(sortDirParam)) {
      return res.json(BAD_REQUEST, { message: 'Invalid sort order' });
    }
      let companyId = Request.GetCompanyId(req);

      let userId = Request.getUserId(req);

      const hasPermission = await Permission.Has(Permission.REPLENISHMENT_MANAGE_OTHERS, req);

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

      let filteredProductIds = await ProductPriceService.getProductIds(searchTerm, companyId)
      if (filteredProductIds && filteredProductIds.length > 0) {
        productIndexWhere.product_id = filteredProductIds;
      }
      if (searchTerm && filteredProductIds.length == 0) {
        productIndexWhere[Op.or] = [
          {
            product_display_name: {
              [Op.iLike]: `%${searchTerm.replace(/\s+/g, "%")}%`,
            },
          },
        ];
      }

      const query = {
        order: sortParam !== "product_name" ? [[sortParam, sortDirParam]] : [[{ model: productIndex, as: "productIndexDetail" }, 'product_name', sortDirParam]],
        include: [
          {
            required: true,
            model: productIndex,
            as: "productIndexDetail",
            where: productIndexWhere,
          },
          {
            model: UserIndex,
            as: "userDetails",
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

      await Replenishment.findAndCountAll(query).then((replenishProducts) => {
        // Return products is null
        if (replenishProducts.count === 0) {
          return res.json({});
        }

        const data = [];

        replenishProducts.rows.forEach((replenishProduct) => {
          const {
            productIndexDetail,
            quantity,
            store_count,
            order_quantity,
            distribution_center_quantity,
            userDetails,
          } = replenishProduct;

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
            mrp,
            cost,
            tax_percentage,
            image,
            product_display_name,
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
          } = productIndexDetail;

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
            store_count: store_count,
            order_quantity: order_quantity,
            distributionCenterQuantity: distribution_center_quantity,
            ownerName: userDetails && String.concatName(userDetails?.first_name,userDetails?.last_name),
          };

          data.push(product);
        });

        res.json({
          totalCount: replenishProducts.count,
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
      res.json(BAD_REQUEST, { message: err.message });
    }
  }

  static async updateReplenishment(companyId) {
    try {
      let productList = await productIndex.findAll({
        where: { company_id: companyId, status: Product.STATUS_ACTIVE },
      });

      let userIds = await UserService.getUsersBySetting(
        Setting.ALLOW_REPLENISHMENT,
        companyId
      );
      // Hard delete all previous records
      await Replenishment.destroy({
        where: { company_id: companyId },
        force: true,
      });

      let distributionCenterId = await getSettingValue(
        location.DISTRIBUTION_CENTER,
        companyId
      );

      let locationList = await Location.findAll({
        where: {
          status: Status.ACTIVE_TEXT,
          company_id: companyId,
          id: { [Op.ne]: distributionCenterId },
        },
        attributes: ["name", "id"],
      });

      let locationIds = locationList.map((value) => value.id);

      let storeProductList = await storeProduct.findAll({
        where: { company_id: companyId, store_id: locationIds },
        attributes: [
          "id",
          "product_id",
          "store_id",
          "transferred_quantity",
          "quantity",
          "min_quantity",
        ],
      });

      let distributionProductList = await storeProduct.findAll({
        where: { company_id: companyId, store_id: distributionCenterId },
        attributes: [
          "id",
          "product_id",
          "store_id",
          "transferred_quantity",
          "quantity",
          "min_quantity",
        ],
      });

      const mapProductsByCompositeKey = (productList) => {
        return productList.reduce((map, product) => {
          const key = `${product.product_id}`;
          map[key] = product;
          return map;
        }, {});
      };

      let distributionCentreData;
      let storeProductData;

      const productMap = mapProductsByCompositeKey(distributionProductList);

      let AllocationArray = [];
      let totalQuantity;

      if (productList && productList.length > 0) {
        for (let k = 0; k < productList.length; k++) {
          const { product_id } = productList[k];

          distributionCentreData = productMap[`${productList[k].product_id}`];
          storeProductData = storeProductList.filter(
            (data) =>
              data.product_id == product_id &&
              (Number.Get(data.quantity) +
                Number.Get(data.transferred_quantity) <
                data.min_quantity ||
                data.quantity === null ||
                data.quantity === 0)
          );
          if (storeProductData && storeProductData.length > 0) {
            totalQuantity = storeProductData.reduce(
              (sum, data) => sum + (data.quantity || 0),
              0
            );

            AllocationArray.push({
              product_id: product_id,
              quantity: totalQuantity,
              distribution_center_quantity: distributionCentreData
                ? distributionCentreData.quantity
                : null,
              store_count: storeProductData.length,
            });
          }
        }
      }

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
        const itemsPerUser = Math.ceil(
          AllocationArray.length / attendanceData.length
        );

        const nonExistingTagData = [];
        // Loop through each attendance entry
        if (AllocationArray && AllocationArray.length > 0) {
          if (attendanceData && attendanceData.length > 0) {
            for (let i = 0; i < attendanceData.length; i++) {
              // Get the slice of AllocationArray data for the current user
              const startIndex = i * itemsPerUser;
             
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

              // Create ReplenishmentAllocation records for the user
              for (let j = 0; j < AllocationArray.length; j++) {
                const productExists = await Replenishment.findOne({
                  where: {
                    product_id: AllocationArray[j].product_id,
                    company_id: companyId,
                  },
                });
                if (!productExists) {
                  let isTagExists =
                    productIds &&
                    productIds.includes(AllocationArray[j].product_id);

                  if (isTagExists) {
                    await Replenishment.create({
                      product_id: AllocationArray[j].product_id,
                      quantity: AllocationArray[j].quantity,
                      owner_id: attendanceData[i].user_id,
                      status:Status.PENDING,
                      company_id: companyId,
                      distribution_center_quantity:
                        AllocationArray[j] &&
                        AllocationArray[j].distribution_center_quantity,
                      store_count:
                        AllocationArray[j] && AllocationArray[j].store_count,
                    });
                  } else {
                    // Add non-existing tag data to the array
                    nonExistingTagData.push(AllocationArray[j]);
                  }
                }
              }
            }
          }
        }


        if (nonExistingTagData && nonExistingTagData.length > 0) {

          if (attendanceData && attendanceData.length > 0) {
            for (let i = 0; i < attendanceData.length; i++) {
              // Get the slice of nonExistingTagData data for the current user
              const startIndex = i * itemsPerUser;
              const endIndex = Math.min(
                startIndex + itemsPerUser,
                nonExistingTagData.length
              );

              const userResponseData = nonExistingTagData.slice(
                startIndex,
                endIndex
              );
      
              // Create ReplenishmentAllocation records for the user
              for (let j = 0; j < userResponseData.length; j++) {
                const productExists = await Replenishment.findOne({
                  where: {
                    product_id: userResponseData[j].product_id,
                    company_id: companyId,
                  },
                });
                if (!productExists) {
                    await Replenishment.create({
                      product_id: userResponseData[j].product_id,
                      quantity: userResponseData[j].quantity,
                      owner_id: attendanceData[i].user_id,
                      company_id: companyId,
                      status:Status.PENDING,
                      distribution_center_quantity:
                        userResponseData[j] &&
                        userResponseData[j].distribution_center_quantity,
                      store_count:
                        userResponseData[j] && userResponseData[j].store_count,
                    });
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

  static async updateOwner(body, companyId) {
    try {
      const { selectedOwner, selectedProducts } = body;

      if (!selectedOwner) {
        throw { message: "Owner Is Required" };
      }

      if (selectedProducts && selectedProducts.length == 0) {
        throw { message: "Product Is Required" };
      }

      for (let i = 0; i < selectedProducts.length; i++) {
        await Replenishment.update(
          { owner_id: selectedOwner },
          { where: { company_id: companyId, product_id: selectedProducts[i] } }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async pendingList(params, companyId, userId) {

    try {
      //destrcuture the params
      let { page, pageSize, sort, sortDir, search, pagination ,replenishmentAllowed} = params;

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

      let settingArray = [];
      
      let settingList = await getSettingList(companyId);

      if(settingList && settingList.length > 0){
      for (let i = 0; i < settingList.length; i++) {
        settingArray.push(settingList[i]);

      }
    }
      let distributionCenterStoreId = await getValueByObject(location.DISTRIBUTION_CENTER,settingArray);

      



      const searchTerm = search ? search.trim() : "";
      const query = `SELECT *
        FROM product_index
        WHERE product_id IN (
          SELECT store_product.product_id
          FROM store_product
          WHERE store_product.quantity > 0
          AND store_product.store_id = ${distributionCenterStoreId} 
        )
        AND product_id NOT IN (
          SELECT transfer_product.product_id
          FROM transfer_product
          WHERE DATE("createdAt") = CURRENT_DATE
            AND transfer_product.product_id IS NOT NULL
      )
        AND (product_name ILIKE '%${searchTerm}%' OR product_display_name ILIKE '%${searchTerm}%' OR brand_name ILIKE '%${searchTerm}%')
        ORDER BY category_name, brand_name, product_name ASC;
       `;

      let queryData = await db.connection.query(query);

      let productList = queryData[1];

      let productArray = [];

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
        };
        productArray.push(data);
      }

      if(replenishmentAllowed){
        return productArray
      }
      
      const offset = (page - 1) * pageSize;
      const paginatedResults = productArray && productArray.slice(offset, offset + pageSize);

      return {
        totalCount: productList.rowCount,
        currentPage: page,
        pageSize,
        data: paginatedResults,
        sort,
        sortDir,
        pagination,
      };
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = ReplenishService;
