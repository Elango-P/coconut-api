const { Op } = require("sequelize");

const {
  storeProduct,
  productIndex,
  Location: LocationModel,
  vendorProduct: vendorProductModel,
  orderProduct
} = require("../db").models;
const validator = require("../lib/validator");
const DataBaseService = require("../lib/dataBaseService");
const Product = require("../helpers/Product");
const Boolean = require("../lib/Boolean");
const Location = require("../helpers/Location");
const { getSettingValue } = require("./SettingService");
const Status = require("../helpers/Status");
const Number = require("../lib/Number");
const storeProductService = new DataBaseService(storeProduct);
const productIndexService = new DataBaseService(productIndex);
const vendorProductService = new DataBaseService(vendorProductModel);

const search = async (params, companyId, req) => {
  try {


    let { page, pageSize, search, sort, pagination, brand, account, date, endDate } = params;
    const sortDirParam = "ASC";

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
    page = page ? parseInt(page, 10) : 1;

    pageSize = pageSize ? parseInt(pageSize, 10) : 25;

    const where = {};

    const productIds = [];
    if (account) {
      let vendorData = await vendorProductService.find({ where: { vendor_id: account, company_id: companyId } });

      for (let i = 0; i < vendorData.length; i++) {
        productIds.push(vendorData[i].product_id);
      }
    }

    const sortOrder = [];
    if (sort == "product_name") {
      sortOrder.push(
        ["brand_name", sortDirParam],
        ["product_name", sortDirParam],
        ["size", sortDirParam],
        ["mrp", sortDirParam]
      );
    }else{
      sortOrder.push(
        ["brand_name", sortDirParam],
        ["product_name", sortDirParam],
        ["size", sortDirParam],
      );
    }
    // Search term
    const searchTerm = search ? search.trim() : null;
    if (searchTerm) {
      where[Op.or] = [
        {
          product_display_name: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    let orderProductWhere = {};
    if (date) {
      orderProductWhere.order_date = {
        [Op.and]: {
          [Op.gte]: date,
        },
      };
    }
    if (brand) {
      where.brand_id = brand;
    }
    where.company_id = companyId;

    if (account) {
      where.product_id = { [Op.in]: productIds };
    }

    where.status = Product.STATUS_ACTIVE;

    const query = {
      where,
      order: sortOrder,
    };
    let storeWhere = {};
    storeWhere.status = Status.ACTIVE_TEXT;

    const storeProductQuery = {
      order: [["quantity", "DESC"]],
      include: [
        {
          require: false,
          model: LocationModel,
          as: "location",
          where: storeWhere,
          attributes: ["id", "name"],
        },
      ],
    };

    if (sort) {
    if (validator.isEmpty(pagination)) {
      pagination = true;
    }
    if (Boolean.isTrue(pagination)) {
      if (pageSize > 0) {
        query.limit = pageSize;
        query.offset = (page - 1) * pageSize;
      }
    }
  }
   
    let productList = [];

    const productIndexList = await productIndexService.findAndCount(query);

    const MainProductIndexData = productIndexList && productIndexList.rows;

    let storeData = await LocationModel.findAll({
      where: { company_id: companyId, status: Status.ACTIVE_TEXT },
    });
    
    const storeProductListData = await storeProductService.find(storeProductQuery);

    const allStoreProductList = new Array();

    if (storeProductListData && storeProductListData.length > 0) {
      for (
        let storeProductListIndex = 0;
        storeProductListIndex < storeProductListData.length;
        storeProductListIndex++
      ) {
        allStoreProductList.push(storeProductListData[storeProductListIndex]);
      }
    }


    if (MainProductIndexData && MainProductIndexData.length > 0) {
      for (let index = 0; index < MainProductIndexData.length; index++) {
        const product_index = MainProductIndexData[index];


        let storeProductDataArray = [];

        let quantity = 0;
        let total_minquantity = 0;
        let total_order_quantity = 0;

        orderProductWhere.product_id=product_index.product_id

        let totalQuantity = await orderProduct.sum('quantity', {
          where: orderProductWhere,
        });
        let storeProductFilter = allStoreProductList.filter((data) => data.product_id == product_index?.product_id);

        if (storeProductFilter && storeProductFilter.length > 0) {
          for (let storeProductIndex = 0; storeProductIndex < storeProductFilter.length; storeProductIndex++) {
            const storeProductData = storeProductFilter[storeProductIndex];


            for (let i = 0; i < storeData.length; i++) {
              if (
                storeProductData?.product_id == product_index?.product_id &&
                storeProductData?.store_id == storeData[i].id
              ) {
            quantity += Number.Get(storeProductData?.quantity);
            total_minquantity += Number.Get(storeProductData?.min_quantity);
            total_order_quantity += Number.Get(storeProductData?.order_quantity);
                let data = {
                  storeName: storeData[i].name,
                  product_name: product_index && product_index?.product_name,
                  image: product_index && product_index?.featured_media_url,
                  quantity: storeProductData && storeProductData?.quantity,
                  minQuantity: storeProductData && storeProductData?.min_quantity,
                };
                storeProductDataArray.push(data);
              }
          }
          }
        }

        let required_quantity = Number.Get(total_minquantity - quantity);

        productList.push({
          product_id: product_index && product_index?.product_id,
          product_name: product_index && product_index?.product_name ? product_index?.product_name : "",
          brand: product_index && product_index?.brand_name ? product_index?.brand_name : "",
          brand_id: product_index && product_index?.brand_id ? product_index?.brand_id : "",
          image: product_index && product_index?.featured_media_url ? product_index?.featured_media_url : "",
          amount: product_index && product_index?.price ? product_index?.price : "",
          mrp: product_index && product_index?.mrp ? product_index?.mrp : "",
          size: product_index && product_index?.size ? product_index?.size : "",
          unit: product_index && product_index?.unit ? product_index?.unit : "",
          amount: product_index && product_index?.price ? product_index?.price : "",
          unit_price: product_index && product_index?.sale_price ? product_index?.sale_price : "",
          price: product_index &&  Number.Get(product_index?.sale_price * product_index?.quantity),
          pack_size: product_index && product_index?.pack_size ? product_index?.pack_size : "",
          sale_price: product_index && product_index?.sale_price ? product_index?.sale_price : "",
          store_required_quantity: required_quantity ? required_quantity : 0,
          store_available_quantity: quantity ? quantity : 0,
          total_order_quantity: totalQuantity,
          total_quantity:quantity,
          storeProductData: storeProductDataArray,
        });
      }
    }
    return {
      totalCount: productIndexList.count,
      currentPage: page,
      pageSize,
      data: productList,
    };
  } catch (err) {
    console.log(err);
    throw { message: err };
  }
};

module.exports = {
  search,
};
