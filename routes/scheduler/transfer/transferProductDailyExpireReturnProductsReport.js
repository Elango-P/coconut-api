const db = require("../../../db");
const ObjectName = require("../../../helpers/ObjectName");
const Setting = require("../../../helpers/Setting");
const TransferType = require("../../../helpers/TransferType");
const DateTime = require("../../../lib/dateTime");
const Request = require("../../../lib/request");
const mailService = require("../../../services/MailService");
const { getSettingValue } = require("../../../services/SettingService");
const History = require("../../../services/HistoryService");
const TransferTypeService = require("../../../services/TransferTypeService");
const schedulerJobCompanyService = require("../schedularEndAt");
const { Op, Sequelize } = require("sequelize");
const errors = require('restify-errors');
const CompanyService = require("../../../services/CompanyService");

const {
  SchedulerJob,
  TransferProduct,
  productIndex,
} = require('../../../db').models;

module.exports = function (req, res) {
  try {
    const company_id = Request.GetCompanyId(req);

    res.send(200, { message: 'Job Started' });

    res.on('finish', async () => {
      let id = req.query.id;


      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });
      let fromMail = await getSettingValue(Setting.FROM_EMAIL, company_id);
      let toMail = schedularData?.to_email;
      let companyDetail = await CompanyService.getCompanyDetailById(company_id);

      const params = {
        companyId: company_id,
        id: id,
        fromMail,
        toMail,
      };
      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      if (company_id) {
        const defaultTimeZone = Request.getTimeZone(req);

        let todayDate = DateTime.getSQlFormattedDate(DateTime.getTodayDate(defaultTimeZone));
        let start_date = DateTime.toGetISOStringWithDayStartTime(todayDate)
        let end_date = DateTime.toGetISOStringWithDayEndTime(todayDate)

        let where = {
          company_id: company_id
        };
        let transferType = await TransferTypeService.getTransferTypeByGroup(TransferType.GROUP_EXPIRED, company_id)
        if (transferType) {
          where.type = transferType.id

        }
        const query = `
  SELECT 
    product_index.*,
    subquery.productCount
  FROM product_index
  INNER JOIN (
    SELECT 
      transfer_product.product_id,
      COUNT(transfer_product.product_id) AS productCount
    FROM transfer_product
    WHERE transfer_product.company_id = ${company_id}
      AND transfer_product.type = ${transferType?.id}
      AND "createdAt" BETWEEN '${DateTime.toGMT(start_date,defaultTimeZone)}' AND '${DateTime.toGMT(end_date,defaultTimeZone)}'
    GROUP BY transfer_product.product_id
    ORDER BY SUM(transfer_product.quantity) DESC 
  ) AS subquery ON product_index.product_id = subquery.product_id;
`;


      let list = await db.connection.query(query)
      let data = []
       let productList = list && list[0]
       for (let i = 0; i < productList.length; i++) {
        const productIndex = productList[i];
        data.push({
          product_name: productIndex?.product_name ? productIndex?.product_name :"",
          brand_name: productIndex?.brand_name ? productIndex?.brand_name:"",
          size: productIndex?.size ? productIndex?.size:"",
          unit: productIndex?.unit? productIndex?.unit:"",
          sale_price: productIndex?.sale_price?productIndex?.sale_price:"",
          mrp: productIndex?.mrp? productIndex?.mrp:"",
          pack_size: productIndex?.pack_size?productIndex?.pack_size:"",
          media_url: productIndex?.featured_media_url?productIndex?.featured_media_url:"",
          total_count:productIndex?.productcount ? productIndex?.productcount : "",
        });
        
       }
      
      if (!toMail) {
        throw new errors.NotFoundError('To Mail Not Found');
    } else {
        toMail = toMail.split(",");
    }

    if (!fromMail) {
        res.send(400, { message: "Default From Email Required" });
    }

   

        const emailSubstitutions = {
          transferProductData: data,
          transferProductCount:data && data.length,
          schedularName: schedularData?.name,
          companyLogo: companyDetail && companyDetail?.company_logo,
          companyName: companyDetail && companyDetail?.company_name,
          reportGeneratedAt: DateTime.getCurrentDateTimeByUserProfileTimezone(new Date(),defaultTimeZone),
        };
            let sentData = {
                toEmail: toMail,
                fromEmail: fromMail,
                subject: "Transfer Product Daily Expired Return Products",
                template: "transferProductDailyExpiredReturnReport",
                substitutions: emailSubstitutions
            }
            mailService.sendMail(params, sentData, () => { });
        


       
       }

      await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      History.create(`${schedularData?.name} Job Completed`, req, ObjectName.SCHEDULER_JOB, id);
    });
  } catch (err) {
    console.log(err);
  }
}