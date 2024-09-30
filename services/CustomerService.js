
const DateTime = require("../lib/dateTime");

const {
    orderProduct,
    productIndex,
    status: statusModel,
    order: orderModel
} = require("../db").models;

const dateTime = new DateTime();

class CustomerService {
    static async searchOrder(params, req) {
        try {
            let { createdBy, type } = params;

            const companyId = Request.GetCompanyId(req);

            const query = {
                where: { createdBy: createdBy, type: type, company_id: companyId },
                sort: [["createdAt", "DESC"]],
                include: [
                    {
                        required: false,
                        model: statusModel,
                        as: "statusDetail",
                        attributes: ["name", "color_code"]
                    }
                ]
            };

            const orders = await orderModel.findAndCountAll(query);

            if (orders.count === 0) {
                return [];
            }

            const orderData = [];

            const ordersRows = orders.rows;

            let orderProducts;

            for (let i = 0; i < ordersRows.length; i++) {

                orderProducts = [];

                const order = ordersRows[i];

                const { statusDetail } = order;

                const orderDetails = { ...order.get() };

                orderDetails.date = orderDetails.date, dateTime.formats.shortDateAndTime;
                orderDetails.total_amount = orderDetails.total_amount;
                orderDetails.order_number = orderDetails.order_number;
                orderDetails.status = statusDetail?.name;
                orderDetails.colorCode = statusDetail?.color_code;
                orderDetails.statusValue = orderDetails.status;
                orderDetails.createdBy = orderDetails?.user?.name;

                orderProducts = await orderProduct.findAll({
                    where: { company_id: companyId, order_id: orderDetails.id, },
                    attributes: ["product_id"],
                    include: [
                        {
                            required: false,
                            model: productIndex,
                            as: "productIndex",
                            attributes: ["product_name"]
                        }
                    ]
                })

                orderDetails.orderProducts = orderProducts

                orderData.push(orderDetails);
            };

            let responseData = {
                totalCount: orders.count,
                data: orderData,
            };

            return responseData;
        } catch (err) {
            console.log(err);
            throw { message: err.message}
        }
    }
}
module.exports = CustomerService;