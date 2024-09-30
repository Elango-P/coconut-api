const {
  PurchaseProduct,
  product: productModel,
  vendorProduct: vendorProductModel,
  Purchase,
  SchedulerJob
} = require('../../../db').models;
const ObjectName = require('../../../helpers/ObjectName');
const Response = require('../../../helpers/Response');
const DataBaseService = require('../../../lib/dataBaseService');
const purchaseProductService = new DataBaseService(PurchaseProduct);
const productService = new DataBaseService(productModel);
const vendorProductService = new DataBaseService(vendorProductModel);
const purchaseService = new DataBaseService(Purchase);

// Lib
const Request = require('../../../lib/request');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');

module.exports = async function (req, res) {
  try {
    let company_id = Request.GetCompanyId(req);

    res.send(Response.OK, { message: 'Job started' });
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

      // Update Product Cost price from recent purchase product
      let purchaseProducts = await purchaseProductService.find({
        where: { company_id: company_id },
        order: [['createdAt', 'ASC']],
        attributes: ['id', 'product_id', 'unit_price'],
      });
      for (let i = 0; i < purchaseProducts.length; i++) {
        const { product_id, unit_price } = purchaseProducts[i];

        let updateData = {
          product_id: product_id,
          cost: unit_price,
        };

        await productService.update(updateData, { where: { id: product_id, company_id: company_id } });
      }

      // Update Product Cost price from recent purchase product

      let productData = await productService.find({ where: { company_id: company_id } });
      for (let i = 0; i < productData.length; i++) {
        const { mrp, cost, sale_price, id } = productData[i];

        let updateData = {};

        updateData.product_id = id;

        if (!cost) {
          updateData.cost = mrp;
        }
        if (!sale_price) {
          updateData.sale_price = mrp;
        }
        await productService.update(updateData, { where: { id: id, company_id: company_id } });
      }

      // Update Product Cost price from recent Purchase product
      let vendorProduct = await vendorProductService.findAndCount({ where: { company_id: company_id } });

      for (let data of vendorProduct.rows) {
        let vendorData = { ...data.get() };
        let purchaseData = await purchaseService.find({
          where: { company_id: company_id, vendor_id: vendorData.vendor_id },
        });

        for (let i = 0; i < purchaseData.length; i++) {
          let { id } = purchaseData[i];

          let purchaseProducts = await purchaseProductService.find({
            where: { company_id: company_id, purchase_id: id, product_id: vendorData.product_id },
            order: [['createdAt', 'ASC']],
          });

          for (let i = 0; i < purchaseProducts.length; i++) {
            let { unit_price, product_id } = purchaseProducts[i];
            if (vendorData.price) {
              let updateData = {
                price: unit_price,
              };
              await vendorProductService.update(updateData, {
                where: { product_id: product_id, vendor_id: vendorData.vendor_id, company_id: company_id },
              });
            }
          }
        }
      }

      // Update unit price from product table

      let products = await productService.findAndCount({ where: { company_id: company_id } });
      for (let data of products.rows) {
        let productData = { ...data.get() };

        let productDatas = await vendorProductService.find({
          where: { company_id: company_id, product_id: productData.id },
        });

        for (let i = 0; i < productDatas.length; i++) {
          const { vendor_id, price, product_id } = productDatas[i];

          let updateData = {};

          if (!price) {
            updateData.price = productData.cost;
          }
          await vendorProductService.update(updateData, {
            where: { product_id: product_id, company_id: company_id, vendor_id: vendor_id },
          });

          //Set Scheduler Status Completed
          await schedulerJobCompanyService.setStatusCompleted(params, (err) => {
            if (err) {
              throw new err();
            }
          });
    History.create(`${schedularData?.name} Job Completed`,req, ObjectName.SCHEDULER_JOB, id);

        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};
