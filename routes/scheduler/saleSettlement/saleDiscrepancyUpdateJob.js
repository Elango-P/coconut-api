const { SaleSettlement, SchedulerJob } = require('../../../db').models;

const { Op } = require("sequelize");
const ObjectName = require('../../../helpers/ObjectName');
const Number = require("../../../lib/Number");
const DateTime = require("../../../lib/dateTime");
// Lib
const Request = require('../../../lib/request');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');

module.exports = async function (req, res) {
  try {
    let company_id = Request.GetCompanyId(req);

    res.send(200, { message: 'Job started' });
    res.on('finish', async () => {

      let  id  = req.query.id;

			let params = { companyId: company_id, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

      History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      let where = {}
      let currentDate = DateTime.getSQlFormattedDate(new Date());

  if(schedularData?.start_date){
  where.date = schedularData?.start_date
  }else{
    where.date = currentDate
  }

  if(schedularData?.endDate){
    where.date = schedularData?.endDate
  }else{
    where.date = currentDate
  }
  
  if (schedularData?.start_date && schedularData?.end_date) {
    where.date = {
      [Op.and]: {
        [Op.gte]: schedularData?.start_date,
        [Op.lte]: schedularData?.end_date,
      },
    };
  }
   where.company_id = company_id
      // Getting sale details
      let saleDetails = await SaleSettlement.findAndCountAll({
        where,
        order: [['createdAt', 'ASC']],
      });

      for (let data of saleDetails.rows) {
        let saleData = { ...data.get() };

        //if sale discrepancy not available

          let newSaleRecordData = {};
          newSaleRecordData.discrepancy_amount_cash = Number.GetFloat(saleData?.amount_cash) - Number.GetFloat(saleData?.order_cash_amount) || null;
          (newSaleRecordData.discrepancy_amount_upi = Number.GetFloat(saleData?.amount_upi) - Number.GetFloat(saleData?.order_upi_amount) || null),
            await SaleSettlement.update(newSaleRecordData, {
              where: { id: saleData.id, company_id: saleData.company_id },
            });

        if (saleData?.amount_cash && saleData?.amount_upi) {
          let newSaleRecordData = {};
          newSaleRecordData.total_amount = Number.GetFloat(saleData?.amount_cash) + Number.GetFloat(saleData?.amount_upi) || null;
          await SaleSettlement.update(newSaleRecordData, {
            where: { id: saleData?.id, company_id: saleData?.company_id },
          });
        }

        if (saleData?.calculated_amount_cash && saleData?.calculated_amount_upi) {
          let newSaleRecordData = {};
          newSaleRecordData.total_calculated_amount =
          Number.GetFloat(saleData?.calculated_amount_cash) + Number.GetFloat(saleData?.calculated_amount_upi) || null;
          await SaleSettlement.update(newSaleRecordData, {
            where: { id: saleData?.id, company_id: saleData?.company_id },
          });
        }

        if (saleData?.received_amount_cash && saleData?.received_amount_upi) {
          let newSaleRecordData = {};
          newSaleRecordData.total_received_amount =
            Number.GetFloat(saleData?.received_amount_cash) + Number.GetFloat(saleData?.received_amount_upi) || null;
          await SaleSettlement.update(newSaleRecordData, {
            where: { id: saleData?.id, company_id: saleData?.company_id },
          });
        }

        if (saleData?.discrepancy_amount_cash || saleData?.discrepancy_amount_upi) {
          let newSaleRecordData = {};
          newSaleRecordData.total_discrepancy_amount =
          Number.GetFloat(saleData?.discrepancy_amount_cash) + Number.GetFloat(saleData?.discrepancy_amount_upi) || null;
          await SaleSettlement.update(newSaleRecordData, {
            where: { id: saleData?.id, company_id: saleData?.company_id },
          });
        }
      }

      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      History.create(`${schedularData?.name} Job Completed`,req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (err) {
    console.log(err);
  }
};
