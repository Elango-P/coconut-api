
const { storeProduct } = require("../db").models;
class StoreProductService {
    async update(quantity, product_id, company_id, store_id) {

        const location = await storeProduct.update({ quantity: quantity, last_stock_entry_date: new Date() }, { where: { product_id: product_id, company_id: company_id, store_id: store_id } });
        if (location) {
            return location
        } else {
            return null
        }
    }
    async decreaseQuantity(quantity, product_id, company_id, store_id, order_date) {

        let toStoreProductDetail = await storeProduct.findOne({
            where: { company_id: company_id, product_id: product_id, store_id: store_id }
        })
        let updatedQuantity = toStoreProductDetail?.dataValues?.quantity

        const location = await storeProduct.update({ quantity: Number(updatedQuantity) - Number(quantity), last_order_date: order_date }, { where: { product_id: product_id, company_id: company_id, store_id: store_id } });
        if (location) {
            return location
        } else {
            return null
        }
    }
    async increaseQuantity(quantity, product_id, company_id, store_id) {

        let toStoreProductDetail = await storeProduct.findOne({
            where: { company_id: company_id, product_id: product_id, store_id: store_id }
        })
        let updatedQuantity = toStoreProductDetail?.dataValues?.quantity

        const location = await storeProduct.update({ quantity: Number(quantity) + Number(updatedQuantity) }, { where: { product_id: product_id, company_id: company_id, store_id: store_id } });
        if (location) {
            return location
        } else {
            return null
        }
    }
  
}
const storeProductService = new StoreProductService()
module.exports = storeProductService;