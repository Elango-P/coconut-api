// const { vendorProduct } = require("../../db").models;
const { vendorProduct, account, SchedulerJob } = require('../../../db').models;

const vendorProductService = require('../../../services/VendorProductService');
const syncService = require('../../../services/SyncService');

const { Op } = require('sequelize');
const History = require('../../../services/HistoryService');
const moment = require('moment');
const { BAD_REQUEST } = require('../../../helpers/Response');

const async = require('async');
const {
  SYNC_OBJECT_NAME_VENDOR_PRODUCT,
  SYNC_NAME_SYNC_FROM_VENDOR_URL,
  SYNC_STATUS_COMPLETED,
  SYNC_STATUS_FAILED,
} = require('../../../helpers/Sync');
const schedulerJobCompanyService = require('../schedularEndAt');
const ObjectName = require('../../../helpers/ObjectName');
const Request = require('../../../lib/request');

module.exports = async function (req, res, next) {
  const companyId = Request.GetCompanyId(req);
  try {
    res.send(200, { message: 'Sync started' });

    res.on('finish', async () => {
      let  id  = req.query.id;

      let params = { companyId: companyId, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: companyId } });

      History.create(`${schedularData?.name} Job Started`,req, ObjectName.SCHEDULER_JOB, id);
      //Set Scheduler Status Completed
      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });
      // Get products
      const products = await vendorProduct.findAll({
        where: { company_id: companyId },
        include: [
          {
            required: true,
            model: account,
            as: 'account',
          },
        ],
      });

      if (!products) {
        return res.json(BAD_REQUEST, { message: 'Product not found' });
      }

      // Sync each product from account
      for (let product of products) {
        try {
          // Get account scraped data
          const productDetails = await vendorProductService.getVendorProductFromUrl(
            product.supplier_url,
            product.supplier.supplier_url,
            companyId
          );

          const updateData = {
            name: productDetails.name,
            description: productDetails.description,
            price: productDetails.mrp,
            salePrice: productDetails.price,
            brandName: productDetails.brandName,
            categoryName: productDetails.typeName,
            images: productDetails.images,
            lastUpdatedAt: moment(new Date(), 'YYYY-MM-DD HH:mm'),
          };
          await vendorProductService.updateProduct(product.id, updateData, companyId);
        } catch (err) {}
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
    res.json(BAD_REQUEST, { message: err.message });
  }
};
