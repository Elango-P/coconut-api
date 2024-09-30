const { Sequelize, Op } = require("sequelize");
const DataBaseService = require("../lib/dataBaseService");
const DateTime = require("../lib/dateTime");
const { getSettingValue } = require("./SettingService");
const { USER_DEFAULT_TIME_ZONE } = require("../helpers/Setting");

const { orderProduct, productIndex } = require("../db").models;

const orderProductService = new DataBaseService(orderProduct);

class OrderProductTop50ReportService {
  static async list(timeZone,company_id) {
    try {

      let where = {};
      where.company_id = company_id

      let start_date = DateTime.toGetISOStringWithDayStartTime(new Date())
      let end_date = DateTime.toGetISOStringWithDayEndTime(new Date())

      where.createdAt = { [Op.and]: {
        [Op.gte]: DateTime.toGMT(start_date,timeZone),
        [Op.lte]: DateTime.toGMT(end_date,timeZone),
      },}

      const query = {
        attributes: [
          "order_product.product_id",
          [Sequelize.fn("COUNT", Sequelize.col("order_product.product_id")), "product_count"],
          [Sequelize.fn("SUM", Sequelize.col("order_product.quantity")), "total_quantity"],
        ],
        group: ["order_product.product_id", "productIndex.id"],
        order: [[Sequelize.literal("product_count"), "DESC"]],
        include: [
          {
            required: true,
            model: productIndex,
            as: "productIndex",
            attributes: [
              "product_name",
              "brand_name",
              "product_id",
              "brand_id",
              "size",
              "unit",
              "sale_price",
              "mrp",
              "pack_size",
              "featured_media_url",
            ],
          },
        ],
        where: where,
        limit: 50,
      };

      let orderProductList = await orderProductService.findAndCount(query);
      let list = [];
      let productData = orderProductList && orderProductList.rows;
      if (productData && productData.length > 0) {
        for (let i = 0; i < productData.length; i++) {
          const { productIndex, dataValues } = productData[i];
          list.push({
            product_count: dataValues?.product_count ? dataValues?.product_count:"",
            quantity: dataValues?.total_quantity?dataValues?.total_quantity:"",
            product_name: productIndex?.product_name ? productIndex?.product_name :"",
            brand_name: productIndex?.brand_name ? productIndex?.brand_name:"",
            size: productIndex?.size ? productIndex?.size:"",
            unit: productIndex?.unit? productIndex?.unit:"",
            sale_price: productIndex?.sale_price?productIndex?.sale_price:"",
            mrp: productIndex?.mrp? productIndex?.mrp:"",
            pack_size: productIndex?.pack_size?productIndex?.pack_size:"",
            media_url: productIndex?.featured_media_url?productIndex?.featured_media_url:"",
          });
        }
      }
      list.sort((a, b) => b.quantity - a.quantity);
  

      return list && list;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = OrderProductTop50ReportService;
