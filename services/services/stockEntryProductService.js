const { Sequelize, Op } = require("sequelize");
const ObjectName = require("../../helpers/ObjectName");
const Request = require("../../lib/request");
const { getFirstStatusDetail } = require("../StatusService");
const DateTime = require("../../lib/dateTime");

// Models
const { StockEntryProduct } = require("../../db").models;

class StockEntryProductService {
  async isExist(productId, stock_entry_id, companyId) {
    if (productId && stock_entry_id && companyId) {
      let stockEntryProduct = await StockEntryProduct.findOne({
        where: { product_id: productId, stock_entry_id: stock_entry_id, company_id: companyId },
      });
      return stockEntryProduct ? true : false;
    } else {
      return false;
    }
  }

   async create(params) {
    let { companyId, productId, stockEntryId, quantity, storeId, created_by } = params;

        let isStockEntryProductExist = await this.isExist(productId,stockEntryId,companyId);
    
        if(!isStockEntryProductExist){
            let initialStockEntryProductStatus = await getFirstStatusDetail(ObjectName.STOCK_ENTRY_PRODUCT, companyId);
        
            let createData = {
              product_id: productId,
              stock_entry_id: stockEntryId,
              company_id: companyId,
              store_id: storeId,
              created_by: created_by,
              status: initialStockEntryProductStatus?.id,
            };
        
            let stockEntryProductDetail = await StockEntryProduct.create(createData);
            return stockEntryProductDetail;
        }

  }


}
const stockEntryProductService = new StockEntryProductService();

module.exports = stockEntryProductService;