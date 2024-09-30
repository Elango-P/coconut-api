const Request = require("../../../lib/request");
const History = require("../../../services/HistoryService");
const schedulerJobCompanyService = require("../schedularEndAt");
const ObjectName = require("../../../helpers/ObjectName");
const Response = require("../../../helpers/Response");
const { Op } = require("sequelize");
const DateTime = require("../../../lib/dateTime");
const { SchedulerJob, order } = require("../../../db").models;
const StatusService = require("../../../services/StatusService");
const Status = require("../../../helpers/Status");

module.exports = async function (req, res) {
  try {
    let companyId = Request.GetCompanyId(req);
    let id = req.query.id;
    let params = { companyId: companyId, id: id };

    const schedularData = await SchedulerJob.findOne({
      where: { id: id, company_id: companyId },
    });

    res.send(Response.OK, { message: `${schedularData?.name} Job Started` });

    res.on("finish", async () => {
      History.create(
        `${schedularData?.name} Job Started`,
        req,
        ObjectName.SCHEDULER_JOB,
        id
      );

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      let draftOrderStatus = await StatusService.getAllStatusByGroupId(ObjectName.ORDER_TYPE,Status.GROUP_DRAFT,companyId)
      let draftOrderStatusIds = draftOrderStatus && draftOrderStatus.length > 0 && draftOrderStatus.map((data)=> data?.id)

      let orderData = await order.findAll({
        where: {
          company_id: companyId,
          total_amount: { [Op.or]: [{ [Op.eq]: 0 }, { [Op.eq]: null }] },
          status:{[Op.in]:draftOrderStatusIds}
        },
        order: [["createdAt", "DESC"]],
        attributes: ["id", "createdAt"],
      });

      if (orderData && orderData.length > 0) {
        let orderArray = orderData.map((value) => ({
            id: value.id,
            createdAt: value.createdAt,
          })).filter(order => DateTime.compareTimeByMinutes(order.createdAt, 15));

        if (orderArray && orderArray.length > 0) {
          for (let i = 0; i < orderArray.length; i++) {
              await order.destroy({
                where: {
                  id: orderArray[i].id,
                },
              });
          }
        }
      }

      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(
        `${schedularData?.name} Job Completed`,
        req,
        ObjectName.SCHEDULER_JOB,
        id
      );
    });
  } catch (err) {
    console.log(err);
  }
};
