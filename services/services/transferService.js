
const Request = require("../../lib/request");

// Models
const { Transfer, Location, storeProduct, product, TransferProduct } = require("../../db").models;

const ProductConstants = require("../../helpers/Product");

const Status = require('../../helpers/Status');

const Number = require('../../lib/Number');

class TransferService {

    async validateProductAvailability(inventoryTranferId, productId, quantity, companyId) {
        try {
            if (inventoryTranferId && productId) {

                let isInventoryTranferExist = await Transfer.findOne({
                    where: { company_id: companyId, id: inventoryTranferId },
                    include: [{
                        required: false,
                        model: Location,
                        as: "from_location",

                    },
                    {
                        required: false,
                        model: Location,
                        as: "to_location",
                    }
                    ]
                })

                if (isInventoryTranferExist) {
                    const { from_location, to_location } = isInventoryTranferExist;

                    if (from_location && to_location) {

                        if (productId) {
                            let isFromStoreProductExist = await storeProduct.findOne({
                                where: { store_id: from_location.id, company_id: companyId, product_id: productId }
                            })

                            let ProductDetail = await product.findOne({
                                where: {
                                    id: productId, company_id: companyId
                                }
                            })

                            let isallowToTransferOutOfStock = ProductDetail && ProductDetail.allow_transfer_out_of_stock == ProductConstants.ALLOW_TRANSFER_PRODUCT_OUT_OF_STOCK ? true : false;

                            if (isFromStoreProductExist) {
                                if (isFromStoreProductExist.quantity > 0 && isFromStoreProductExist.quantity >= quantity || isallowToTransferOutOfStock) {
                                    return true;
                                } else {
                                    throw { message: "Out of stock" }
                                }
                            } else {
                                throw { message: "Location Product Not Found" }
                            }
                        } else {
                            throw { message: "Location Product Id Required" }
                        }

                    } else {
                        throw { message: `${!from_location ? "From" : "To"} Location Not Found` };
                    }
                } else {
                    throw { message: "Inventory Transfer Not Found" };
                }
            }

        } catch (err) {
            return false;
        }
    }

    async isExist(productId, transferId, companyId) {

        if (productId && transferId && companyId) {
            let transferProduct = await TransferProduct.findOne({
                where: { product_id: productId, transfer_id: transferId, company_id: companyId }
            })
            return transferProduct ? true : false;

        } else {
            return false;
        }
    }
}

const transferService = new TransferService();

module.exports = transferService;