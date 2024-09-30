const { Op } = require("sequelize");
const Number = require("../lib/Number");
const statusService = require("./StatusService");
const ObjectName = require("../helpers/ObjectName");
const Status = require("../helpers/Status");

const { productCategory, productIndex, orderProduct } = require("../db").models;

class CategoryService{

    static async getCategoryDetailsById(id,company_id){
        const categoryDetails = await productCategory.findOne({
            where: { id ,company_id},
        });
        return categoryDetails && categoryDetails;
    }


  static async updateOrderQuantity(params) {
    try {
      let { companyId } = params;

      const categoryDetails = await productCategory.findAll({
        where: { company_id: companyId },
      });

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

      if (categoryDetails && categoryDetails.length > 0) {
        for (let i = 0; i < categoryDetails.length; i++) {
          let producData = await productIndex.findAll({
            where: {
              category_id: categoryDetails[i].id,
              company_id: companyId,
            },
          });

          let productIds = producData.map((value) => value.product_id);

          if (productIds && productIds.length > 0) {
            const orderQty = await orderProduct.sum("quantity", {
              where: {
                product_id: { [Op.in]: productIds },
                company_id: companyId,
                status: {
                  [Op.notIn]: statusIdsArray,
                },
              },
            });

            await productCategory.update(
              { order_quantity: Number.Get(orderQty) },
              { where: { id: categoryDetails[i].id } }
            );
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = CategoryService;
