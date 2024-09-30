const ObjectName = require("../../helpers/ObjectName");
const Order = require("../../helpers/Order");
const Product = require("../../helpers/Product");
//importing from models
const { status, order, product } = require("../../db").models;

async function storeDashboardCount(req, res) {
  const company_id = req.user && req.user.company_id;
  //defining orderstatus based on active as in the create route it defined default as Draft
  const statusOrder = await status.findOne({
    where: { company_id: company_id, object_name: ObjectName.ORDER_TYPE, name: Order.STATUS_COMPLETED },
  });

  try {
    let orderCount;
    if(statusOrder){
      orderCount = await order.count({
       where: { company_id, status: statusOrder?.id },
     });
    }
    //in product status defined defaultly
    let productCount = await product.count({
      where: { company_id, status: Product.STATUS_ACTIVE },
    });

    return res.json({
      productCount: productCount,
      orderCount: orderCount,
    });
  } catch (err) {
    console.log(err);
    (err) => res.status(400).send({ message: err.message });
  }
}
module.exports = storeDashboardCount;
