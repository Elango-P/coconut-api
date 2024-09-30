const ObjectName = require("../../../helpers/ObjectName");
const { FROM_EMAIL } = require("../../../helpers/Setting");
const Request = require("../../../lib/request");
const { getSettingValue } = require("../../../services/SettingService");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const {
  SchedulerJob,
  order,
  User,
  Location: LocationModel,
  orderProduct: orderProductModal,
  productIndex,
} = require("../../../db").models;
const errors = require("restify-errors");
const { Op } = require("sequelize");
const DateTime = require("../../../lib/dateTime");
const Currency = require("../../../lib/currency");
const String = require("../../../lib/string");
const Setting = require("../../../helpers/Setting");
const StatusService = require("../../../services/StatusService");
const Status = require("../../../helpers/Status");
const { getCompanyDetailById } = require("../../../services/CompanyService");
const OrderProductcancelledReportService = require("../../../services/orderProductcancelledReportService");

module.exports = async (req, res, next) => {
  const companyId = Request.GetCompanyId(req);
  let id = req.query.id;
  const schedularData = await SchedulerJob.findOne({
    where: { id: id, company_id: companyId },
  });
  const fromMail = await getSettingValue(FROM_EMAIL, companyId);
  let toMail = schedularData?.to_email;

  let userDefaultTimeZone = Request.getTimeZone(req);
  let currentDateTime = DateTime.getDateTimeByUserProfileTimezone(
    new Date(),
    userDefaultTimeZone
  );
  let start_date = DateTime.toGetISOStringWithDayStartTime(currentDateTime);
  let end_date = DateTime.toGetISOStringWithDayEndTime(currentDateTime);
  let companyDetail = await getCompanyDetailById(companyId);
  const params = {
    companyId: companyId,
    id: id,
    fromMail,
    toMail,
  };

  try {
    res.send(200, { message: `${schedularData?.name} Job Started` });
    History.create(
      `${schedularData?.name} Job Started`,
      req,
      ObjectName.SCHEDULER_JOB,
      id
    );

    res.on("finish", async () => {
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
    });

    if (companyId) {
      if (!fromMail) {
        throw new errors.NotFoundError("From Mail Not Found");
      }
      if (!schedularData?.to_email) {
        throw new errors.NotFoundError("To Mail Not Found");
      } else {
        toMail = toMail.split(",");
      }
    }

    /* ✴---Get Draft Order Status---✴ */
    let cancelledOrderProductStatus = await StatusService.getAllStatusByGroupId(
      ObjectName.ORDER_PRODUCT,
      Status.GROUP_CANCELLED,
      companyId
    );
    let cancelledOrderProductStatusIds =
      cancelledOrderProductStatus &&
      cancelledOrderProductStatus.length > 0 &&
      cancelledOrderProductStatus.map((data) => data?.id);

    let userList = await User.findAll({
      where: {
        company_id: companyId,
        status: Status.ACTIVE,
      },
      attributes: ["id", "name", "last_name", "media_url"],
    });

    let userData = [];

    if (userList.length > 0) {
      for (let index = 0; index < userList.length; index++) {
        const userId = userList[index];
        let orderCancelOrderProductList = [];

        await order
          .findAll({
            where: {
              company_id: companyId,
              owner: userId.id,
              date: {
                [Op.and]: {
                  [Op.gte]: DateTime.toGMT(start_date, userDefaultTimeZone),
                  [Op.lte]: DateTime.toGMT(end_date, userDefaultTimeZone),
                },
              },
            },
            attributes: ["id", "owner"],
          })
          .then(async (orderList) => {
            if (orderList && orderList.length > 0) {
              for (let j = 0; j < orderList.length; j++) {
                await orderProductModal
                  .findAll({
                    where: {
                      order_id: orderList[j]?.id,
                      company_id: companyId,
                      status: {
                        [Op.in]: cancelledOrderProductStatusIds,
                      },
                    },
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
                    attributes: [
                      "order_date",
                      "price",
                      "order_number",
                      "quantity",
                      "createdAt", // Include created_at
                      "cancelled_at", // Include cancelled_at
                    ],
                  })
                  .then((orderProductList) => {
                    if (orderProductList && orderProductList.length > 0) {
                      for (let k = 0; k < orderProductList.length; k++) {
                        if (userId.id == orderList[j].owner) {
                          // Calculate the time interval
                          let createdAt = new Date(
                            orderProductList[k]?.createdAt
                          );
                          let cancelledAt = new Date(
                            orderProductList[k]?.cancelled_at
                          );
                          let cancelledProductTimeInterval = DateTime.TimeDifference(createdAt, cancelledAt);

                          orderCancelOrderProductList.push({
                            order_date:
                              DateTime.getDateTimeByUserProfileTimezone(
                                orderProductList[k]?.order_date,
                                userDefaultTimeZone
                              ),
                            price: Currency.IndianFormat(
                              orderProductList[k]?.price
                            ),
                            orderNumber: orderProductList[k]?.order_number,
                            orderQuantity: orderProductList[k]?.quantity,
                            productId:
                              orderProductList[k]?.productIndex?.product_id,
                            productName:
                              orderProductList[k]?.productIndex?.product_name,
                            brandName:
                              orderProductList[k]?.productIndex?.brand_name,
                            brandId:
                              orderProductList[k]?.productIndex?.brand_id,
                            size: orderProductList[k]?.productIndex?.size,
                            unit: orderProductList[k]?.productIndex?.unit,
                            salePrice:
                              orderProductList[k]?.productIndex?.sale_price,
                            mrp: orderProductList[k]?.productIndex?.mrp,
                            packSize:
                              orderProductList[k]?.productIndex?.pack_size,
                            imageUrl:
                              orderProductList[k]?.productIndex
                                ?.featured_media_url,
                            timeInterval: cancelledProductTimeInterval,
                          });
                        }
                      }
                    }
                  });
              }
              if (orderCancelOrderProductList.length > 0) {
                userData.push({
                  userName: userId?.name,
                  userLastName: userId?.last_name,
                  data: orderCancelOrderProductList,
                });
              }
            }
          });
      }
    }

    if (toMail.length > 0 && toMail !== null) {
      if (userData && userData.length > 0) {
        OrderProductcancelledReportService.sendMail(
          params,
          {
            userData: userData,
            count: userData && userData.length,
            companyName: companyDetail && companyDetail?.company_name,
            reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(
              new Date(),
              userDefaultTimeZone
            ),
            schedularName: schedularData && schedularData?.name,
            companyLogo: companyDetail && companyDetail?.company_logo,
          },
          (err) => {
            if (err) {
              throw new err();
            }
          }
        );
      }
      History.create(
        `${schedularData?.name} Job Completed`,
        req,
        ObjectName.SCHEDULER_JOB,
        id
      );
    }
  } catch (error) {
    History.create(
      `${schedularData?.name} error - ${error.message}`,
      req,
      ObjectName.SCHEDULER_JOB,
      id
    );
    await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
      if (err) {
        throw new err();
      }
    });
    console.log(error);
  }
};
