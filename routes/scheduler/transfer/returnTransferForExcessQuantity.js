const Request = require('../../../lib/request');
const {
  storeProduct,
  SchedulerJob,
  status: statusModal,
  productIndex,
  Transfer: TransferModal,
  TransferProduct,
  TransferType,
} = require('../../../db').models;
const StoreService = require('../../../services/LocationService');
const ObjectName = require('../../../helpers/ObjectName');
const History = require('../../../services/HistoryService');
const schedulerJobCompanyService = require('../schedularEndAt');
const DataBaseService = require('../../../lib/dataBaseService');
const TransferProductStatus = require('../../../helpers/TransferProduct');
const Status = require('../../../helpers/Status');
const Transfer = require('../../../helpers/Transfer')
const storeProductService = new DataBaseService(storeProduct);
const statusService = new DataBaseService(statusModal);
const transferService = new DataBaseService(TransferModal);

module.exports = function (req, res) {
  const getNextTransferNumber = async (company_id) => {
    let transfer_number;
    //get lastTransfer
    let lastTransfer = await transferService.findOne({
      order: [['createdAt', 'DESC']],
      where: { company_id },
    });

    //get lastTransfer
    transfer_number = lastTransfer && lastTransfer.transfer_number;
    //validate lastTransfer exist or no
    if (!transfer_number) {
      transfer_number = 1;
    } else {
      transfer_number = transfer_number + 1;
    }

    return transfer_number;
  };
  try {
    const company_id = Request.GetCompanyId(req);

    res.send(200, { message: 'Job Started' });

    res.on('finish', async () => {
      let  id  = req.query.id;

			let params = { companyId: company_id, id: id };

      const schedularData = await SchedulerJob.findOne({ where: { id: id, company_id: company_id } });

      History.create(`${schedularData?.name} Job Started`, req, ObjectName.SCHEDULER_JOB, id);

      await schedulerJobCompanyService.setStatusStarted(params, (err) => {
        if (err) {
          throw new err();
        }
      });

      if (company_id) {
        try {
          const storeList = await StoreService.search(company_id);

          const status = await statusService.findOne({
            where: {
              company_id: company_id,
              name: Status.GROUP_DRAFT_TEXT,
              object_name: ObjectName.TRANSFER,
            },
          });
          if (storeList && storeList.length > 0) {
            for (let i = 0; i < storeList.length; i++) {
              const { id } = storeList[i];

              let where = {};

              where.company_id = company_id;
              where.store_id = id;
              const order = [];
              order.push([{ model: productIndex, as: 'productIndex' }, 'category_name', 'ASC']);
              const query = {
                where,
                order,
                include: [
                  {
                    required: true,
                    duplicating: false,
                    model: productIndex,
                    as: 'productIndex',
                  },
                ],
              };

              const storeProductList = await storeProductService.find(query);

              let transferDetail = [];

              let products = storeProductList.filter(
                (storeProductList) => storeProductList.max_quantity < storeProductList.quantity
              );
              if (products && products.length > 0) {
                for (let i = 0; i < products.length; i++) {
                  const { id, min_quantity, max_quantity, quantity, store, productIndex } = products[i];

                  if (quantity != null && quantity > max_quantity) {
                    const excessQuantity = quantity - max_quantity;
                    transferDetail.push({
                      excessQuantity: excessQuantity,
                      product_id: productIndex.product_id,
                      store_id: id,
                    });
                  }
                }
              }

              let transferType = await TransferType.findOne({
                where: { name: Transfer.TYPE_EXCESS_RETURN_TEXT, company_id: company_id },
              });

              if (transferDetail.length > 0) {
                let createData = {
                  status: status?.id,
                  date: new Date(),
                  transfer_number: await getNextTransferNumber(company_id),
                  from_store_id: id,
                  to_store_id: transferType.default_to_store,
                  type: transferType.id,
                  owner_id: req.user.id,
                  company_id: company_id,
                };
                let transferData = await transferService.create(createData);

                for (let i = 0; i < transferDetail.length; i++) {
                  const { excessQuantity, product_id } = transferDetail[i];

                  const createData = {
                    company_id: company_id,
                    status: TransferProductStatus.DRAFT,
                    transfer_id: transferData.id,
                    product_id: product_id,
                    quantity: excessQuantity,
                    type: transferData.type,
                    from_store_id: transferData.from_store_id,
                    to_store_id: transferData.to_store_id,
                  };

                  await TransferProduct.create(createData);
                }
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
      //   Set Scheduler Status Completed
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
};
